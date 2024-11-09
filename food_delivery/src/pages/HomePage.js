import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ProductList from '../pages/product/ProductList';
import ProductDetails from '../pages/product/ProductDetails';
import BlogList from './BlogList';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
        setError(''); // Clear error on success
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogsCollection);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogList);
        setError(''); // Clear error on success
      } catch (error) {
        setError('Error fetching blogs');
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchProducts();
    fetchBlogs();
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  return (
    <Container>
      <h1>Welcome to Our Website!</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loadingProducts ? (
        <div>Loading products...</div>
      ) : !selectedProduct ? (
        <ProductList products={products} onSelect={handleProductSelect} />
      ) : (
        <ProductDetails product={selectedProduct} />
      )}
      {loadingBlogs ? (
        <div>Loading blogs...</div>
      ) : (
        <BlogList blogs={blogs} />
      )}
    </Container>
  );
};

export default HomePage;
