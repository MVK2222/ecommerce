import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from './logo.png';
import { FaSearch, FaShoppingCart, FaUser, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import CircumIcon from "@klarr-agency/circum-icons-react";
import { useAuth } from '../contexts/AuthContext';
import * as HoverCard from '@radix-ui/react-hover-card';
import algoliasearch from 'algoliasearch';

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const LogoContainer = styled.div`
  img {
    width: 100px;
    height: auto;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    background-color: #fff;
    position: absolute;
    top: 60px;
    left: ${({ open }) => (open ? '0' : '-100%')};
    width: 200px;
    transition: left 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 10px;

  &:hover {
    color: #007bff;
  }
`;

const SearchBox = styled.form`
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 10px;
  }

  input {
    padding: 5px 10px 5px 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const SearchResultsContainer = styled.div`
  position: absolute;
  top: 40px; // Adjust this value based on your layout
  background: white;
  border: 1px solid #ccc;
  width: 300px; // Adjust this value based on your layout
  max-height: 300px;
  overflow-y: auto;
  z-index: 999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CartIconContainer = styled.div`
  position: relative;
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-left: 10px;
  }
`;

const CartIconBadge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff0000;
  color: #000000;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
`;

const AccountIconContainer = styled.div`
  position: relative;
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
`;

const DropdownMenu = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 999;
  min-width: 250px;

  ul {
    list-style: none;
    margin: 0;
    padding: 10px;
  }

  li {
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      background-color: #f0f0f0;
    }

    a {
      text-decoration: none;
      color: inherit;
      width: 100%;
      display: flex;
      align-items: center;
    }

    svg {
      margin-right: 10px;
    }
  }

  .sign-up {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;

    a {
      color: #007bff;
    }
  }
`;

const MenuToggle = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: relative;

    input[type="checkbox"] {
      display: none;
    }

    .menu-btn {
      display: block;
      cursor: pointer;
    }

    .menu-btn span {
      display: block;
      width: 30px;
      height: 4px;
      margin: 5px auto;
      background-color: #000;
      transition: all 0.3s ease;
    }

    input[type="checkbox"]:checked + .menu-btn span:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }

    input[type="checkbox"]:checked + .menu-btn span:nth-child(2) {
      opacity: 0;
    }

    input[type="checkbox"]:checked + .menu-btn span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }

    input[type="checkbox"]:checked ~ ul {
      left: 0;
    }
  }
`;

const algoliaClient = algoliasearch('3KBUWFHR1J', '065cdf95a60ffe22d46930a73594daa2');
const index = algoliaClient.initIndex('products');

const Header = ({ cartCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, isAdmin, adminView, toggleAdminView, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1); // Track selected item for keyboard navigation

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const algoliaParams = {
          params: {
            query: searchQuery,
            params: {
              attributesToRetrieve: ['name', 'description', 'price'],
              hitsPerPage: 10,
            },
          },
        };
        const algoliaResults = await index.search(algoliaParams);
        const searchResults = algoliaResults.hits;

        setSearchResults(searchResults);
        setSearchError(searchResults.length === 0? 'No products found.' : '');
      } catch (error) {
        console.error('Error searching products', error);
        setSearchResults([]);
        setSearchError('Failed to fetch search results.');
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedItemIndex(-1); // Reset selected item index when input changes
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim().toLowerCase(); // Trim any leading or trailing whitespace and convert to lowercase

    if (trimmedQuery === '') {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    try {
      const algoliaParams = {
        params: {
          query: trimmedQuery,
          params: {
            attributesToRetrieve: ['name', 'description', 'price'],
            hitsPerPage: 10,
          },
        },
      };
      const algoliaResults = await index.search(algoliaParams);
      const searchResults = algoliaResults.hits;

      setSearchResults(searchResults);
      setSearchError(searchResults.length === 0? 'No products found.' : '');
    } catch (error) {
      console.error('Error searching products', error);
      setSearchResults([]);
      setSearchError('Failed to fetch search results.');
    }
  };
  

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  };

  const handleAccountClick = () => {
    if (currentUser) {
      navigate('/account');
    } else {
      navigate('/signin');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleSearchItemClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e, productId) => {
    if (e.key === 'Enter') {
      navigate(`/product/${productId}`);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = selectedItemIndex > 0? selectedItemIndex - 1 : searchResults.length - 1;
      setSelectedItemIndex(newIndex);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = selectedItemIndex < searchResults.length - 1? selectedItemIndex + 1 : 0;
      setSelectedItemIndex(newIndex);
    }
  };

  const renderNavLinks = () => {
    if (isAdmin && adminView) {
      return (
        <>
          <NavLink to="/admin/">Dashboard</NavLink>
          <NavLink to="/admin/products">Manage Products</NavLink>
          <NavLink to="/admin/users">Manage Users</NavLink>
        </>
      );
    } else {
      return (
        <>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </>
      );
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </LogoContainer>

      <NavLinks open={menuOpen}>
        {renderNavLinks()}
      </NavLinks>

      <MenuToggle>
        <input type="checkbox" checked={menuOpen} onChange={handleMenuToggle} />
        <div className="menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </MenuToggle>

      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <SearchBox onSubmit={handleSearchSubmit}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchBox>

        {(searchResults.length > 0 || searchError) && (
          <SearchResultsContainer>
            {searchResults.map((result, index) => (
              <SearchResultItem
                key={result.id}
                onClick={() => handleSearchItemClick(result.id)}
                onKeyDown={(e) => handleKeyDown(e, result.id)}
                tabIndex={0}
                style={{ backgroundColor: selectedItemIndex === index ? '#f0f0f0' : 'inherit' }}
              >
                {result.name}
              </SearchResultItem>
            ))}
            {searchError && (
              <SearchResultItem>{searchError}</SearchResultItem>
            )}
          </SearchResultsContainer>
        )}

        {isAdmin && (
          <AccountIconContainer onClick={toggleAdminView}>
            {adminView ? (
              <FaToggleOn />
            ) : (
              <FaToggleOff />
            )}
          </AccountIconContainer>
        )}

        <HoverCard.Root>
          <HoverCard.Trigger asChild>
            <AccountIconContainer>
              <FaUser onClick={handleAccountClick} />
            </AccountIconContainer>
          </HoverCard.Trigger>
          <HoverCard.Content align="end">
            <DropdownMenu>
              {!currentUser ? (
                <>
                  <div className="sign-up">
                    <span>New customer?</span>
                    <Link to="/signup">Sign Up</Link>
                  </div>
                  <ul>
                    <li>
                      <Link to="/signin">
                        <CircumIcon name="login" color="#000" size="20px" />
                        Login
                      </Link>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <ul>
                    <li>
                      <Link to="/account">
                        <FaUser />
                        Account
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <CircumIcon name="logout" color="#000" size="20px" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </DropdownMenu>
          </HoverCard.Content>
        </HoverCard.Root>

        <CartIconContainer onClick={handleCartClick}>
          <FaShoppingCart />
          {cartCount > 0 && <CartIconBadge>{cartCount}</CartIconBadge>}
        </CartIconContainer>
      </div>
    </HeaderContainer>
  );
};

export default Header;
