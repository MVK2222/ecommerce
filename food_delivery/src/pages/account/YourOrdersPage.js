// Import necessary modules from React and Firebase
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

// Define styled components for different sections of the page
const OrdersContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const OrdersHeader = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;

  button {
    background: none;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;

    &.active {
      border-bottom: 2px solid #000;
      font-weight: bold;
    }
  }
`;

const OrdersFilter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  select {
    padding: 5px;
    font-size: 16px;
  }
`;

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
`;

const OrderItem = styled.li`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const NextFilterLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #0073bb;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  input {
    width: 70%;
    padding: 10px;
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
  }
`;

// Main component for displaying the user's orders
const YourOrdersPage = () => {
  // Get the current user from the authentication context
  const { currentUser } = useAuth();

  // State variables for managing orders, filter, active tab, loading state, error message, and search term
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('last 30 days');
  const [activeTab, setActiveTab] = useState('Orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Define filter options for the dropdown menu
  const filterOptions = ['last 30 days', 'past 3 months', '2024', '2023', '2022'];

  // Function to get the next filter option in the dropdown menu
  const getNextFilter = (currentFilter) => {
    const currentIndex = filterOptions.indexOf(currentFilter);
    return filterOptions[(currentIndex + 1) % filterOptions.length];
  };

  // Fetch orders from Firebase based on the current user, filter, and active tab
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const ordersCollection = collection(db, 'orders');
        let baseQuery = query(ordersCollection, where('userId', '==', currentUser.uid));

        const now = new Date();
        switch (filter) {
          case 'last 30 days':
            baseQuery = query(baseQuery, where('orderDate', '>=', Timestamp.fromDate(new Date(now.setDate(now.getDate() - 30)))));
            break;
          case 'past 3 months':
            baseQuery = query(baseQuery, where('orderDate', '>=', Timestamp.fromDate(new Date(now.setMonth(now.getMonth() - 3)))));
            break;
          case '2024':
            baseQuery = query(baseQuery, where('orderDate', '>=', Timestamp.fromDate(new Date('2024-01-01'))), where('orderDate', '<=', Timestamp.fromDate(new Date('2024-12-31'))));
            break;
          case '2023':
            baseQuery = query(baseQuery, where('orderDate', '>=', Timestamp.fromDate(new Date('2023-01-01'))), where('orderDate', '<=', Timestamp.fromDate(new Date('2023-12-31'))));
            break;
          case '2022':
            baseQuery = query(baseQuery, where('orderDate', '>=', Timestamp.fromDate(new Date('2022-01-01'))), where('orderDate', '<=', Timestamp.fromDate(new Date('2022-12-31'))));
            break;
          default:
            baseQuery = query(baseQuery);
        }

        let ordersQuery;
        switch (activeTab) {
          case 'Not Yet Shipped':
            ordersQuery = query(baseQuery, where('status', '==', 'Not Yet Shipped'));
            break;
          case 'Cancelled Orders':
            ordersQuery = query(baseQuery, where('status', '==', 'Cancelled'));
            break;
          case 'Buy Again':
            ordersQuery = query(baseQuery, where('status', '==', 'Delivered'));
            break;
          default:
            ordersQuery = baseQuery;
        }

        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders = querySnapshot.docs.map(doc => doc.data());
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('There was an issue fetching your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, filter, activeTab]);

  // Handle search functionality
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ordersCollection = collection(db, 'orders');
      const searchQuery = query(
        ordersCollection,
        where('userId', '==', currentUser.uid),
        where('productName', '>=', searchTerm),
        where('productName', '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(searchQuery);
      const searchedOrders = querySnapshot.docs.map(doc => doc.data());
      setOrders(searchedOrders);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('There was an issue fetching search results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render the component
  return (
    <OrdersContainer>
      <OrdersHeader>Your Orders</OrdersHeader>

      <Tabs>
        {['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </Tabs>

      <OrdersFilter>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </OrdersFilter>

      <SearchContainer>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name"
        />
        <button onClick={handleSearch}>Search Orders</button>
      </SearchContainer>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : orders.length === 0 ? (
        <NoOrdersMessage>
          Looks like you have not placed an order in the last {filter}. 
          <NextFilterLink onClick={() => setFilter(getNextFilter(filter))}>
            View orders in {getNextFilter(filter)}
          </NextFilterLink>
        </NoOrdersMessage>
      ) : (
        <OrderList>
          {orders.map((order, index) => (
            <OrderItem key={index}>
              <p>Order #{index + 1}</p>
              <p>Product Name: {order.productName}</p>
              <p>Order Date: {order.orderDate.toDate().toDateString()}</p>
              <p>Status: {order.status}</p>
            </OrderItem>
          ))}
        </OrderList>
      )}
    </OrdersContainer>
  );
};

export default YourOrdersPage;