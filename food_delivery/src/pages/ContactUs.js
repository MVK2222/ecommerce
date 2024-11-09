import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

// Keyframes for slide animation
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled component for the container
const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #fff;
  color: #000;
  min-height: 100vh;
  animation: ${slideIn} 1s ease-out;
`;

// Styled component for the header
const Header = styled.h1`
  margin-bottom: 10px;
`;

// Styled component for the subheader
const Subheader = styled.p`
  color: #2eb82e;
  margin-bottom: 20px;
`;

// Styled component for the information section
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

// Styled component for each info item
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 1.2em;

  svg {
    margin-right: 10px;
  }
`;

// Styled component for social media links
const SocialMedia = styled.div`
  display: flex;
  gap: 20px;
  font-size: 1.5em;
  margin-bottom: 20px;

  a {
    color: #333;
    transition: color 0.3s;

    &:hover {
      color: #2eb82e;
    }
  }
`;

// Styled component for the form
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Styled component for the input fields
const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
`;

// Styled component for the submit button
const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #2eb82e;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #29a329;
  }
`;

// Styled component for the thank you message container
const ThankYouContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #c9a7ff;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Component for the thank you message
const ThankYouMessage = () => (
  <ThankYouContainer>
    <img src="your-logo.png" alt="Logo" style={{ marginBottom: '20px' }} />
    <h1>Thank you for subscribing!</h1>
    <p>You'll be among the first to receive our exclusive content, discounts and product updates.</p>
  </ThankYouContainer>
);

// Main ContactUs component
const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ContactContainer>
      {submitted ? (
        <ThankYouMessage />
      ) : (
        <>
          <Header>CONNECT WITH US</Header>
          <Subheader>Subscribe and stay up to date on the latest news, get exclusive offers and special gifts.</Subheader>
          <InfoSection>
            <InfoItem>
              <FaPhoneAlt /> +123 456 7890
            </InfoItem>
            <InfoItem>
              <FaEnvelope /> contact@example.com
            </InfoItem>
            <SocialMedia>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </SocialMedia>
          </InfoSection>
          <Form onSubmit={handleSubmit}>
            <Input type="text" placeholder="First Name" required />
            <Input type="text" placeholder="Last Name" required />
            <Input type="email" placeholder="Your Email" required />
            <SubmitButton type="submit">SIGN ME UP</SubmitButton>
          </Form>
        </>
      )}
    </ContactContainer>
  );
};

export default ContactUs;