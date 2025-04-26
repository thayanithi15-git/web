import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, offer: 0 });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await fetch(`${API_URL}/products/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      setEditMode(false);
      setEditId(null);
    } else {
      await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
    }
    setNewProduct({ name: '', price: 0, offer: 0 });
    fetchProducts();
  };

  const editProduct = (product) => {
    setEditMode(true);
    setEditId(product.id);
    setNewProduct({ name: product.name, price: product.price, offer: product.offer || 0 });
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="container">
      <h1>Product Management</h1>
      
      <form onSubmit={handleSubmit} className="product-form">
        <input 
          type="text" 
          placeholder="Product Name" 
          value={newProduct.name} 
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={newProduct.price} 
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Offer %" 
          value={newProduct.offer} 
          onChange={(e) => setNewProduct({...newProduct, offer: e.target.value})} 
        />
        <button type="submit">{editMode ? 'Update' : 'Add'} Product</button>
      </form>
      
      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            {product.offer > 0 && <p className="offer">{product.offer}% OFF</p>}
            <div className="actions">
              <button onClick={() => editProduct(product)}>Edit</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;