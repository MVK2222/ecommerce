// src/components/AdminFloatingButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from 'react-icons/md';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff00ff; // Pink color to match your uploaded icon
  border: none;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background-color: #e600e6; // Darker pink on hover
  }
`;

const AdminFloatingButton = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <FloatingButton onClick={() => navigate('/admin')}>
      <MdAdminPanelSettings size={24} color="#fff" />
    </FloatingButton>
  );
};

export default AdminFloatingButton;
