import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  text-align: center;
  width: 250px;
  background-color: ${props => props.isDark ? '#333' : '#fff'};
  color: ${props => props.isDark ? '#fff' : '#000'};
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #e0e0e0 25%, transparent 25%) -50px 0,
              linear-gradient(225deg, #e0e0e0 25%, transparent 25%) -50px 0,
              linear-gradient(315deg, #e0e0e0 25%, transparent 25%),
              linear-gradient(45deg, #e0e0e0 25%, transparent 25%);
  background-size: 100px 100px;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
`;

const ToggleButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  position: relative;
`;

const ShareButton = styled.a`
  display: block;
  background: #0073e6;
  color: white;
  padding: 10px;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  position: absolute;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transform: ${props => (props.isVisible ? 'scale(1)' : 'scale(0)')};
`;

const Price = styled.p`
  color: ${props => props.isDark ? '#4caf50' : '#154'};
  font-size: 1.5em;
  font-weight: bold;
`;

const OldPrice = styled.span`
  color: ${props => props.isDark ? '#fff' : '#999'};
  text-decoration: line-through;
  margin-left: 10px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 16px;
  margin-top: 20px;
`;

const ProductCard = ({ product, isDark }) => {
  const [isShareActive, setShareActive] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [quantity, setQuantity] = useState(1); // add quantity state

  const toggleShareButtons = () => {
    setShareActive(!isShareActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.buttons')) {
        setShareActive(false);
      }
    };

    if (isShareActive) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isShareActive]);

  const buttonPositions = [
    { x: 0, y: -100 },  // WhatsApp
    { x: 70, y: -70 },  // Facebook
    { x: 100, y: 0 },   // Copy Link
    { x: 70, y: 70 }    // Email
  ];

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${window.location.href}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    copylink: `${window.location.href}`,
    email: `mailto:?subject=Check%20this%20out&body=${window.location.href}`
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard');
    });
  };

  const handleAddToCart = async () => {
    const newItem = {
      productId: product.id,
      quantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
    };
  
    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);
      try {
        const cartDoc = await getDoc(cartDocRef);
        if (cartDoc.exists()) {
          const cartItems = cartDoc.data().items;
          const existingItem = cartItems.find((item) => item.productId === product.id);
  
          if (existingItem) {
            // Update the quantity of the existing item
            existingItem.quantity += quantity;
            await updateDoc(cartDocRef, {
              items: cartItems,
            });
          } else {
            // Add a new item to the cart
            cartItems.push(newItem);
            await updateDoc(cartDocRef, {
              items: cartItems,
            });
          }
        } else {
          await setDoc(cartDocRef, {
            items: [newItem],
          });
        }
        setSuccessMessage('Product added to cart successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error adding to cart:', err);
      }
    } else {
      const cartItems = localStorage.getItem('cartItems');
      if (cartItems) {
        const items = JSON.parse(cartItems);
        const existingItem = items.find((item) => item.productId === product.id);
  
        if (existingItem) {
          // Update the quantity of the existing item
          existingItem.quantity += quantity;
        } else {
          // Add a new item to the cart
          items.push(newItem);
        }
        localStorage.setItem('cartItems', JSON.stringify(items));
      } else {
        localStorage.setItem('cartItems', JSON.stringify([newItem]));
      }
      setSuccessMessage('Product added to cart successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  return (
    <Card isDark={isDark}>
      <Link to={`/products/${product.id}`}>
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} />
        ) : (
          <Placeholder />
        )}
      </Link>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Price isDark={isDark}>
        ${product.price} <OldPrice isDark={isDark}>${product.oldPrice}</OldPrice>
      </Price>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.category}</p>
      <Link to={`/products/${product.id}`}>View Details</Link>
      
      <ButtonContainer className="buttons">
        <ToggleButton className="buttons_toggle" onClick={toggleShareButtons}>
          <i className="fa fa-share-alt"></i>
        </ToggleButton>
        {['whatsapp', 'facebook', 'copylink', 'email'].map((platform, index) => (
          <ShareButton
          key={platform}
          href={platform === 'copylink' ? '#' : shareUrls[platform]}
          target={platform !== 'copylink' ? "_blank" : ""}
          rel="noopener noreferrer"
          isVisible={isShareActive}
          style={{
            top: `${buttonPositions[index].y}px`,
            left: `${buttonPositions[index].x}px`,
          }}
          onClick={platform === 'copylink' ? (e) => { e.preventDefault(); copyToClipboard(shareUrls[platform]); } : null}
        >
          <i className={`fa fa-${platform === 'copylink' ? 'link' : platform}`}></i>
        </ShareButton>
        ))}
      </ButtonContainer>
      <ActionButton onClick={handleAddToCart}>Add to Cart</ActionButton>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </Card>
  );
};

export default ProductCard;
