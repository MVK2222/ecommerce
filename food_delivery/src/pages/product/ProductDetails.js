import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const DetailsSection = styled.div`
  flex: 1;
  padding-left: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SKU = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  font-size: 16px;
`;

const QuantityDisplay = styled.span`
  padding: 0 10px;
  font-size: 16px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const AdditionalInfo = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const SectionContent = styled.p`
  font-size: 14px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 16px;
  margin-top: 20px;
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'products', id);
        const docSnap = await getDoc(productDoc);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          setError('Product not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error fetching product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product,
        quantity,
      },
    });
  };

  const handleAddToCart = async () => {
    const newItem = {
      productId: id,
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
          await updateDoc(cartDocRef, {
            items: arrayUnion(newItem),
          });
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
        items.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(items));
      } else {
        localStorage.setItem('cartItems', JSON.stringify([newItem]));
      }
      setSuccessMessage('Product added to cart successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <Container>
      <ImageSection>
        {product?.imageUrl && <Image src={product.imageUrl} alt={product.name} />}
      </ImageSection>
      <DetailsSection>
        <Title>{product?.name}</Title>
        <SKU>SKU: {product?.sku}</SKU>
        <Price>${product?.price}</Price>
        <Description>{product?.description}</Description>
        <QuantitySection>
          <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
          <QuantityDisplay>{quantity}</QuantityDisplay>
          <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
        </QuantitySection>
        <div>
          <ActionButton onClick={handleAddToCart}>Add to Cart</ActionButton>
          <ActionButton onClick={handleBuyNow}>Buy Now</ActionButton>
        </div>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        <AdditionalInfo>
          <SectionTitle>Product Info</SectionTitle>
          <SectionContent>{product?.productInfo}</SectionContent>
          <SectionTitle>Return & Refund Policy</SectionTitle>
          <SectionContent>{product?.returnPolicy}</SectionContent>
          <SectionTitle>Shipping Info</SectionTitle>
          <SectionContent>{product?.shippingInfo}</SectionContent>
        </AdditionalInfo>
      </DetailsSection>
    </Container>
  );
};

export default ProductDetails;
