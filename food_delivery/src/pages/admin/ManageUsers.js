// src/pages/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    await addDoc(collection(db, 'users'), newUser);
    setNewUser({ name: '', email: '' });
  };

  const handleUpdateUser = async (id, updatedUser) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, updatedUser);
  };

  const handleDeleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <Link to="/admin" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007bff' }}>
        &larr; Return to Admin Dashboard
      </Link>
      <div>
        <input
          type="text"
          placeholder="User Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button onClick={() => handleUpdateUser(user.id, { name: user.name, email: user.email })}>Update</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
