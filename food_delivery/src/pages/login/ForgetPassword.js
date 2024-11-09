// ForgotPassword.js

// Import necessary modules from React and Firebase
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

// Styled components for the UI elements
const Container = styled.div`
  // Styling for the main container div
  padding: 40px;
  border-radius: 20px;
  border: 8px solid transparent;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
  background: #223243;
`;

const Form = styled.form`
  // Styling for the form element
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  color: #fff;

  h2 {
    // Styling for the form title
    font-weight: 500;
    letter-spacing: 0.1em;
  }
`;

const InputBox = styled.div`
  // Styling for the input box div
  position: relative;
  width: 300px;
`;

const Input = styled.input`
  // Styling for the input element
  padding: 12px 10px 12px 48px;
  border: none;
  width: 100%;
  background: #223243;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #fff;
  font-weight: 300;
  border-radius: 25px;
  font-size: 1em;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35);
  transition: 0.5s;
  outline: none;

  &:valid ~ span,
  &:focus ~ span {
    // Styling for the span element when input is valid or focused
    color: #00dfc4;
    border: 1px solid #00dfc4;
    background: #223243;
    transform: translateX(25px) translateY(-7px);
    font-size: 0.6em;
    padding: 0 8px;
    border-radius: 10px;
    letter-spacing: 0.1em;
  }

  &:valid,
  &:focus {
    // Styling for the input element when input is valid or focused
    border: 1px solid #00dfc4;
  }
`;

const Span = styled.span`
  // Styling for the span element
  position: absolute;
  left: 0;
  padding: 12px 10px 12px 48px;
  pointer-events: none;
  font-size: 1em;
  font-weight: 300;
  transition: 0.5s;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
`;

const Icon = styled.i`
  // Styling for the icon element
  position: absolute;
  top: 15px;
  left: 16px;
  width: 25px;
  padding: 2px 0;
  padding-right: 8px;
  color: #00dfc4;
  border-right: 1px solid #00dfc4;
`;

/*const SubmitButton = styled.input`
  // Commented out styling for the submit button
  background: #00dfc4;
  color: #223243;
  padding: 10px 0;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 300px;
  border-radius: 25px;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
};*/

const Paragraph = styled.p`
  // Styling for the paragraph element
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75em;
  font-weight: 300;

  button {
    // Styling for the button element inside the paragraph
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
  }
`;

// Functional component for the ForgotPassword page
const ForgotPassword = () => {
  // State for storing the email input
  const [email, setEmail] = useState('');

  // Navigate function for routing
  const navigate = useNavigate();

  // Function to handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email using Firebase auth
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
      navigate('/sign-in'); // Redirect to sign-in page
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert(error.message);
    }
  };

  // JSX for the ForgotPassword component
  return (
    <Container>
      <Form onSubmit={handlePasswordReset}>
        <h2>Forgot Password</h2>
        <InputBox>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Icon className="fa-regular fa-envelope"></Icon>
          <Span>Email address</Span>
        </InputBox>
        <Paragraph>
          <a href="/sign-in" onClick={(e) => { e.preventDefault(); navigate('/sign-in'); }}>
            Back to Sign In
          </a>
        </Paragraph>
      </Form>
    </Container>
  );
};

export default ForgotPassword;