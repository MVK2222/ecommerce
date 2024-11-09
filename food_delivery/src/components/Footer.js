import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const theme = {
  pInline: 'clamp(0.75rem, 0.6286rem + 0.5178vw, 2rem)',
  pBlock: '1rem',
  gap: '1rem',
  borderRadius: '2rem',
  fsSmall: 'clamp(0.75rem, 0.6286rem + 0.5178vw, 0.95rem)',
  fsMedium: 'clamp(1rem, 0.6966rem + 1.0945vw, 1.25rem)',
  fsLarge: 'clamp(1.5rem, 1.0291rem + 1.2924vw, 3rem)',
  colorWhite: '#fff',
  colorBlack: '#000',
  colorGray: '#666',
  colorLightGray: '#f7f7f7',
};

const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.colorLightGray};
  color: ${({ theme }) => theme.colorBlack};
  padding: ${({ theme }) => theme.pBlock} 0;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.pBlock};

  @media(min-width: 320px) {
    width: 100%;
    padding: 0 20px;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.pBlock};

  img {
    max-height: 40px;
  }

  @media(min-width: 320px) {
    margin-bottom: 0;
  }
`;

const FooterColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media(min-width: 320px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media(max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FooterColumn = styled.div`
  margin: 0 ${({ theme }) => theme.pInline};
  text-align: center;

  h3 {
    font-size: ${({ theme }) => theme.fsMedium};
    margin-bottom: ${({ theme }) => theme.gap};
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: ${({ theme }) => theme.gap};
  }

  a {
    color: ${({ theme }) => theme.colorGray};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media(min-width: 320px) {
    text-align: left;
    margin: 0 ${({ theme }) => theme.pInline};
  }

  @media(max-width: 480px) {
    margin: 0 ${({ theme }) => theme.pInline / 2};
    font-size: ${({ theme }) => theme.fsSmall};
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.pBlock} 0;
  border-top: 1px solid ${({ theme }) => theme.colorGray};

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fsSmall};
  }

  @media(max-width: 480px) {
    padding: ${({ theme }) => theme.pBlock / 2} 0;
  }
`;

const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
      <FooterContainer>
        <FooterWrapper>
          <LogoContainer>
            <img src={logo} alt="Logo" />
          </LogoContainer>
          <FooterColumns>
            <FooterColumn>
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h3>Explore More</h3>
              <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h3>Connect with Us</h3>
              <ul>
                <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
              </ul>
            </FooterColumn>
          </FooterColumns>
        </FooterWrapper>
        <FooterBottom>
          <p>&copy; 2024 Organic Theory, Inc. All rights reserved.</p>
        </FooterBottom>
      </FooterContainer>
    </ThemeProvider>
  );
};

export default Footer;