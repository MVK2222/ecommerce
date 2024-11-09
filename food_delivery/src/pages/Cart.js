import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CartItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  width: 100%;
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`;

const CartButton = styled.button`
  margin-left: 10px;
`;

const TotalPrice = styled.p`
  font-weight: bold;
  margin-top: 20px;
`;

const CheckoutButton = styled.button`
  background-color: #4CAF50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ContinueShoppingButton = styled.button`
  background-color: #008CBA;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const ErrorMsg = styled.p`
  color: red;
`;

const CartPage = () => {
  const [user] = useAuthState(auth);
  const [cartItems, setCartItems] = useState([]);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setLocalCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const cartDocRef = doc(db, 'carts', user.uid);
          const cartDoc = await getDoc(cartDocRef);

          if (cartDoc.exists()) {
            setCartItems(cartDoc.data().items || []);
          } else {
            setCartItems([]); 
            await setDoc(cartDocRef, { items: localCartItems });
          }
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchCartItems();
    } else {
      setCartItems(localCartItems);
      setLoading(false);
    }
  }, [user, localCartItems]);

  useEffect(() => {
    if (user && localCartItems.length > 0) {
      const updateCartItemsInFirestore = async () => {
        try {
          const cartDocRef = doc(db, 'carts', user.uid);
          const cartDoc = await getDoc(cartDocRef);

          if (cartDoc.exists()) {
            const updatedItems = [...cartDoc.data().items];
            localCartItems.forEach((item) => {
              const existingItem = updatedItems.find((i) => i.productId === item.productId);
              if (existingItem) {
                existingItem.quantity += item.quantity; 
              } else {
                updatedItems.push(item);
              }
            });
            await updateDoc(cartDocRef, { items: updatedItems });
            setCartItems(updatedItems);
          } else {
            await setDoc(cartDocRef, { items: localCartItems });
            setCartItems(localCartItems);
          }
          localStorage.removeItem('cartItems');
          setLocalCartItems([]); 
        } catch (error) {
          console.error(error);
        }
      };

      updateCartItemsInFirestore();
    }
  }, [user, localCartItems]);

  const updateCartItem = async (item, action) => {
    try {
      const existingItem = cartItems.find((i) => i.productId === item.productId);

      if (existingItem) {
        let newQuantity;
        if (action === 'increase') {
          newQuantity = existingItem.quantity + 1;
        } else if (action === 'decrease') {
          newQuantity = existingItem.quantity - 1;
          if (newQuantity < 1) {
            newQuantity = 1; 
          }
        }

        existingItem.quantity = newQuantity;

        setCartItems([...cartItems]);

        if (user) {
          const cartDocRef = doc(db, 'carts', user.uid);
          await updateDoc(cartDocRef, { items: cartItems });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const removeCartItem = async (item) => {
    try {
      if (user) {
        const cartDocRef = doc(db, 'carts', user.uid);

        const updatedItems = cartItems.filter((i) => i.productId!== item.productId);

        await updateDoc(cartDocRef, { items: updatedItems });
        setCartItems(updatedItems);
      } else {
        const updatedItems = cartItems.filter((i) => i.productId!== item.productId);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) {
    return <Container>Loading cart...</Container>;
  }

  if (error) {
    return <Container><ErrorMsg>{error}</ErrorMsg></Container>;
  }

  const handleContinueShopping = () => {
    navigate('/products', { replace: true });
  };

  return (
    <Container>
      <h1>Cart</h1>
      {cartItems.length === 0? (
        <div>
          <p>Your cart is empty</p>
          <ContinueShoppingButton onClick={handleContinueShopping}>
            Continue Shopping
          </ContinueShoppingButton>
        </div>
      ) : (
        <>
          <CartList>
            {cartItems.map((item) => (
              <CartItem key={item.productId}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CartItemImage src={item.imageUrl} alt={item.name} />
                  {item.name} - ${item.price * item.quantity}
                </div>
                <div>
                  <CartButton onClick={() => updateCartItem(item, 'decrease')}>-</CartButton>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <CartButton onClick={() => updateCartItem(item, 'increase')}>+</CartButton>
                  <CartButton onClick={() => removeCartItem(item)}>Remove</CartButton>
                </div>
              </CartItem>
            ))}
          </CartList>
          <TotalPrice>Total price: ₨{totalPrice.toFixed(2)}</TotalPrice>
          {cartItems.length > 0 && (
            <Link to="/checkout">
              <CheckoutButton onClick={async () => {
                try {
                  const tempRef = db.collection('temp').doc(user.uid);
                  await tempRef.set({ items: cartItems });
                } catch (error) {
                  console.error(error);
                }
              }}>Proceed to Checkout</CheckoutButton>
            </Link>
          )}
        </>
      )}
    </Container>
  );
};

export default CartPage;