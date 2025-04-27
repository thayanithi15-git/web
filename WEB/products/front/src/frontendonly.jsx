import React, { useState } from "react";
import "./frontend.css";

function FrontendOnly() {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState({ name: "", amount: "", offer: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    if (!input.name || !input.amount || !input.offer) return;
    if (isEditing) {
      setProducts(products.map(product =>
        product.id === editId ? { ...product, ...input } : product
      ));
      setIsEditing(false);
      setEditId(null);
    } else {
      setProducts([...products, { ...input, id: Date.now() }]);
    }
    setInput({ name: "", amount: "", offer: "" });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const editProduct = (product) => {
    setInput({ name: product.name, amount: product.amount, offer: product.offer });
    setIsEditing(true);
    setEditId(product.id);
  };

  return (
    <div className="app">
      <h1>🛒 eKart Product Manager</h1>
      <div className="form">
        <input
          name="name"
          placeholder="Product Name"
          value={input.name}
          onChange={handleChange}
        />
        <input
          name="amount"
          placeholder="Amount (₹)"
          type="number"
          value={input.amount}
          onChange={handleChange}
        />
        <input
          name="offer"
          placeholder="Offer (%)"
          type="number"
          value={input.offer}
          onChange={handleChange}
        />
        <button onClick={addProduct}>{isEditing ? "Update" : "Add"}</button>
      </div>

      <div className="product-list">
        {products.length === 0 && <p className="no-data">No products added.</p>}
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <h2>{p.name}</h2>
            <p>Amount: ₹{p.amount}</p>
            <p>Offer: {p.offer}%</p>
            <div className="actions">
              <button className="edit" onClick={() => editProduct(p)}>✏️ Edit</button>
              <button className="delete" onClick={() => deleteProduct(p.id)}>❌ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrontendOnly;
