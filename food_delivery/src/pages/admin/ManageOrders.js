// src/pages/admin/ManageOrders.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const orderSnapshot = await getDocs(ordersCollection);
      const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    };
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (id, updatedOrder) => {
    const orderDoc = doc(db, 'orders', id);
    await updateDoc(orderDoc, updatedOrder);
  };

  const handleDeleteOrder = async (id) => {
    const orderDoc = doc(db, 'orders', id);
    await deleteDoc(orderDoc);
  };

  return (
    <div>
      <h1>Manage Orders</h1>
      <Link to="/admin" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007bff' }}>
        &larr; Return to Admin Dashboard
      </Link>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Status: {order.status}</p>
            <button onClick={() => handleUpdateOrder(order.id, { status: 'Updated Status' })}>Update</button>
            <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;
