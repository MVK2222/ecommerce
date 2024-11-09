import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, storage } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Papa from 'papaparse';

const Container = styled.div`
  font-family: 'Inter', sans-serif;
  padding: 2rem;
  background-color: #f9f9f9;
`;

// Defining a styled-component for the header
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
  }
    .button-group {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: black;
    background-color: #f9f9f9;
    border: solid 1px;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #aeb7bd;
    }
      
  }
`;

// Defining a styled-component for a button
export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #ffffff; ;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;

  &:hover {
    background-color: #aeb7bd;
    color: #000000;
    border-color: #000000;
  }
`;

// Defining a styled-component for a label
export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a4a4a;
  display: block;
  margin-bottom: 0.5rem;
`;

// Defining a styled-component for an input field
export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  width: 100%;
  margin-bottom: 1rem;
`;

// Defining a styled-component for a textarea field
export const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  width: 100%;
  margin-bottom: 1rem;
`;

// Defining a styled-component for a select field
export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  width: 100%;
  margin-bottom: 1rem;
`;

// Defining a styled-component for a checkbox input field
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.5rem;
`;

// Defining a styled-component for a card component
export const Card = styled.div`
  background-color: white;
  border: 1px solid #dcdcdc;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Defining a styled-component for an image wrapper
export const ImageWrapper = styled.div`
  margin-top: 1rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 0.25rem;
  }
`;

// Defining a styled-component for the product table
export const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th, td {
    border: 1px solid #dcdcdc;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

// Defining a styled-component for the search bar
export const SearchBar = styled.input`
  padding: 0.75rem;
  border: 1px solid #dcdcdc;
  border-radius: 0.25rem;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    status: 'In Stock',
    imageUrl: '',
    categories: [],
    sku: '',
    variations: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (error) {
        setError('Error fetching products');
      }
    };
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewProduct({ ...newProduct, imageUrl: file });
    } else {
      setError('Please select an image file');
    }
  };

  const handleEditProduct = (product) => {
    if (product){
      setEditingProduct(product);
      setNewProduct({ ...newProduct , ...product});
    }
  };

  const handleAddProduct = async () => {
    if (!isValid) return;
    try {
      let imageUrl = '';
      if (newProduct.imageUrl instanceof File) {
        const imageRef = ref(storage, `products/${newProduct.name}`);
        await uploadBytes(imageRef, newProduct.imageUrl);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productToAdd = { ...newProduct, imageUrl };
      await addDoc(collection(db, 'products'), productToAdd);

      // Fetch updated products list
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setError('');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        status: 'In Stock',
        imageUrl: '',
        categories: [],
        sku: '',
        variations: []
      });
    } catch (error) {
      setError('Error adding product: ' + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    if (!isValid) return;
    try {
      const productDoc = doc(db, 'products', editingProduct.id);
      if (newProduct.imageUrl instanceof File) {
        const imageRef = ref(storage, `products/${newProduct.name}`);
        await uploadBytes(imageRef, newProduct.imageUrl);
        newProduct.imageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(productDoc, { ...newProduct });

      // Fetch updated products list
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        status: 'In Stock',
        imageUrl: '',
        categories: [],
        sku: '',
        variations: []
      });
      setError('');
    } catch (error) {
      setError('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);

      // Fetch updated products list
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setError('');
    } catch (error) {
      setError('Error deleting product');
    }
  };

  const validateForm = () => {
    const { name, description, price, quantity, sku, categories, variations } = newProduct;
    if (name && description && !isNaN(price) && !isNaN(quantity) && 
    sku && categories.length > 0 &&
     variations.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [newProduct]);

  const handleBulkUpload = (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      console.log('CSV file selected:', file.name);
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          console.log('CSV file parsed:', results.data);
          if (results.data) {
            try {
              const bulkProducts = results.data;
              const batch = writeBatch(db);
              const productsCollection = collection(db, 'products');
              bulkProducts.forEach((product) => {
                const newProductRef = doc(productsCollection);
                batch.set(newProductRef, product);
              });
              await batch.commit();
              console.log('Bulk upload successful!');
              // Fetch updated products list
              const productSnapshot = await getDocs(productsCollection);
              const productList = productSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setProducts(productList);
            } catch (error) {
              console.error('Error uploading products:', error.message);
              setError('Error uploading products: ' + error.message);
            }
          } else {
            console.error('Error parsing CSV file: no data found');
            setError('Error parsing CSV file: no data found');
          }
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error.message);
          setError('Error parsing CSV file: ' + error.message);
        },
      });
    } else {
      console.error('Please select a CSV file');
      setError('Please select a CSV file');
    }
  };

  return (
    <Container>
      <Header>
        <h1>Product Management</h1>
        <div className="button-group">
          <Button onClick={() => setEditingProduct(null)}>Add New Product</Button>
          <Button>
            Bulk Upload 
            <label htmlFor="bulk-upload-file" onClick={() => document.getElementById('bulk-upload-file').click()}> Select CSV file</label>
            <input 
              id="bulk-upload-file"
              type="file" 
              accept=".csv" 
              onChange={handleBulkUpload} 
              style={{ display: 'none' }} 
            />
          </Button>
        </div>
      </Header>

      {error && <div>{error}</div>}

      <Card>
        <Label>Product Name</Label>
        <Input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <Label>Description</Label>
        <Textarea
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <Label>Price</Label>
          <Input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Label>Quantity</Label>
          <Input
            type="number"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <Label>Status</Label>
          <Select
            value={newProduct.status}
            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </Select>
          <Label>SKU</Label>
          <Input
            type="text"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <Label>Categories</Label>
          <Input
            type="text"
            value={newProduct.categories.map((category) => category.name).join(',')}
            onChange={(e) =>{
              const categories = e.target.value.split(',').map((category) => ({
                name: category.trim(),
                subcategories: [] //initialize with an empty subcategories array
              }));
              setNewProduct({ ...newProduct, categories });
            }}
          />
          {newProduct.categories.map((category, index) => (
            <div key={index}>
              <span>{category.name}</span>
              {category.subcategories.length > 0 && (
                <ul>
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex}>{subcategory.name}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {newProduct.categories.map((category, index) => (
            <div key={index}>
              <span>{category.name}</span>
              <Input
                type="text"
                value={category.subcategories.map((subcategory) => subcategory.name).join(', ')}
                onChange={(e) => {
                  const subcategories = e.target.value.split(',').map((subcategory) => ({
                    name: subcategory.trim()
                  }));
                  const updatedCategories = [...newProduct.categories];
                  updatedCategories[index].subcategories = subcategories;
                  setNewProduct({ ...newProduct, categories: updatedCategories });
                }}
              />
            </div>
          ))}
          <Label>Variations</Label>
          <Textarea
            value={newProduct.variations ? newProduct.variations.join('\n') : ''}
            onChange={(e) =>
              setNewProduct({ ...newProduct, variations: e.target.value.split('\n') })
            }
          />
          <Label>Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
            disabled={!isValid}
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </Card>
  
        <ProductTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>SKU</th>
              <th>Categories</th>
              <th>Variations</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.status}</td>
                <td>{product.sku}</td>
                <td>{product.categories ? product.categories.join(', ') : 'N/A'}</td>
                <td>{product.variations ? product.variations.join(', ') : 'N/A'}</td>
                <td>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />
                </td>
                <td>
                  <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
      </Container>
    );
  };
  
  export default ProductManagement;
