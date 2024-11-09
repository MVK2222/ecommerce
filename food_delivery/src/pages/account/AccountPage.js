import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaLock, FaBox, FaAddressCard, FaUser, FaArchive, FaHeadset, FaCreditCard,} from 'react-icons/fa';

// Main container for the Account Page
const AccountContainer = styled.div`
  padding: 40px;
  background-color: #f7f7f7;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Header for the Account Page
const Header = styled.h1`
  margin-bottom: 20px;
`;

// Container for all the account options
const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

// Individual option card
const OptionCard = styled(Link)`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Icon for each option
const OptionIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  color: #007bff;
`;

// Title for each option
const OptionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

// Description for each option
const OptionDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

const AccountPage = () => {
  return (
    <AccountContainer>
      {/* Header of the account page */}
      <Header>Your Account</Header>
      
      {/* Container holding all the option cards */}
      <OptionsContainer>
        <OptionCard to="/your-orders">
          <OptionIcon><FaBox /></OptionIcon>
          <OptionTitle>Your Orders</OptionTitle>
          <OptionDescription>Track, return, or buy things again</OptionDescription>
        </OptionCard>
        <OptionCard to="/login-security">
          <OptionIcon><FaLock /></OptionIcon>
          <OptionTitle>Login & Security</OptionTitle>
          <OptionDescription>Edit login, name, and mobile number</OptionDescription>
        </OptionCard>
        <OptionCard to="/your-address">
          <OptionIcon><FaAddressCard /></OptionIcon>
          <OptionTitle>Your Addresses</OptionTitle>
          <OptionDescription>Edit addresses for orders and gifts</OptionDescription>
        </OptionCard>
        <OptionCard to="/payment-options">
          <OptionIcon><FaCreditCard /></OptionIcon>
          <OptionTitle>Payment Options</OptionTitle>
          <OptionDescription>Edit or add payment methods</OptionDescription>
        </OptionCard>
        <OptionCard to="/archived-orders">
          <OptionIcon><FaArchive /></OptionIcon>
          <OptionTitle>Archived Orders</OptionTitle>
          <OptionDescription>View and manage your archived orders</OptionDescription>
        </OptionCard>
        <OptionCard to="/contact">
          <OptionIcon><FaHeadset /></OptionIcon>
          <OptionTitle>Contact Us</OptionTitle>
          <OptionDescription>Get help with your orders</OptionDescription>
        </OptionCard>
      </OptionsContainer>
    </AccountContainer>
  );
};

export default AccountPage;
