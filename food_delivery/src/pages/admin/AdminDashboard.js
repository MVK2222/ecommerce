// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { db } from '../../firebaseConfig';  // Ensure your firebase config is correctly set up
import { collection, query, where, getDocs } from 'firebase/firestore';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f4f4;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const NavItem = styled.div`
  color: #fff;
  cursor: pointer;
  margin: 15px 0;
  font-size: 1.2em;
  &:hover {
    color: #1abc9c;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterLabel = styled.div`
  margin-right: 10px;
`;

const Filter = styled.select`
  margin-right: 20px;
  padding: 10px;
  font-size: 1em;
`;

const ChartContainer = styled.div`
  margin-top: 20px;
`;

const NoData = styled.div`
  padding: 20px;
  background-color: #f8d7da;
  color: #721c24;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('last 7 days');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSalesData();
    fetchOrdersData();
    fetchCustomersData();
  }, [selectedDateRange, selectedCategory]);

  const fetchSalesData = async () => {
    let salesQuery = collection(db, 'sales');
    const today = new Date();

    if (selectedDateRange === 'last 7 days') {
      const startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      salesQuery = query(salesQuery, where('date', '>=', startDate));
    } else if (selectedDateRange === 'last 30 days') {
      const startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      salesQuery = query(salesQuery, where('date', '>=', startDate));
    } // Implement custom date range logic if needed

    if (selectedCategory !== 'all') {
      salesQuery = query(salesQuery, where('category', '==', selectedCategory));
    }

    const salesSnapshot = await getDocs(salesQuery);
    const sales = salesSnapshot.docs.map(doc => doc.data());
    setSalesData(sales);
  };

  const fetchOrdersData = async () => {
    let ordersQuery = collection(db, 'orders');
    // Apply date range and category filters to ordersQuery similarly
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    setOrdersData(orders);
  };

  const fetchCustomersData = async () => {
    let customersQuery = collection(db, 'customers');
    // Apply date range and category filters to customersQuery similarly
    const customersSnapshot = await getDocs(customersQuery);
    const customers = customersSnapshot.docs.map(doc => doc.data());
    setCustomersData(customers);
  };

  // Example chart data - Replace with actual data fetching and processing
  const salesChartData = {
    labels: salesData.map(sale => sale.date), // Example: Array of dates
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(sale => sale.amount), // Example: Array of sales amounts
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ordersChartData = {
    labels: ['Pending', 'Fulfilled'],
    datasets: [
      {
        label: 'Orders',
        data: [/* Example: Array of counts */],
        backgroundColor: ['#f6c23e', '#1cc88a'],
        borderColor: ['#f6c23e', '#1cc88a'],
        borderWidth: 1,
      },
    ],
  };

  const customersChartData = {
    labels: ['New', 'Returning'],
    datasets: [
      {
        label: 'Customers',
        data: [/* Example: Array of counts */],
        backgroundColor: ['#4e73df', '#36b9cc'],
        borderColor: ['#4e73df', '#36b9cc'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Sidebar>
        <h2>Ecommerce Dashboard</h2>
        <NavItem>Dashboard</NavItem>
        <NavItem>Products</NavItem>
        <NavItem>Orders</NavItem>
        <NavItem>Customers</NavItem>
        <NavItem>Reports</NavItem>
      </Sidebar>
      <Content>
        <Title>Admin Dashboard</Title>
        <FilterContainer>
          <FilterLabel>Date Range:</FilterLabel>
          <Filter value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)}>
            <option value="last 7 days">Last 7 days</option>
            <option value="last 30 days">Last 30 days</option>
            <option value="custom">Custom</option>
          </Filter>
          <FilterLabel>Category:</FilterLabel>
          <Filter value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </Filter>
        </FilterContainer>
        <ChartContainer>
          {salesData.length > 0 ? (
            <Line data={salesChartData} />
          ) : (
            <NoData>No sales data available for the selected filters.</NoData>
          )}
        </ChartContainer>
        <ChartContainer>
          {ordersData.length > 0 ? (
            <Bar data={ordersChartData} />
          ) : (
            <NoData>No orders data available for the selected filters.</NoData>
          )}
        </ChartContainer>
        <ChartContainer>
          {customersData.length > 0 ? (
            <Doughnut data={customersChartData} />
          ) : (
            <NoData>No customers data available for the selected filters.</NoData>
          )}
        </ChartContainer>
      </Content>
    </Container>
  );
};

export default AdminDashboard;
