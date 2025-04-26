const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'thaya2006s',
  database: 'ecommerce'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// GET all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new product
app.post('/api/products', (req, res) => {
  const { name, price, offer } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  db.query(
    'INSERT INTO products (name, price, offer) VALUES (?, ?, ?)', 
    [name, price, offer || 0], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, price, offer: offer || 0 });
    }
  );
});

// PUT (update) a product
app.put('/api/products/:id', (req, res) => {
  const { name, price, offer } = req.body;
  const id = req.params.id;
  
  db.query(
    'UPDATE products SET name = ?, price = ?, offer = ? WHERE id = ?',
    [name, price, offer || 0, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, price, offer: offer || 0 });
    }
  );
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});