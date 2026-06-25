// Node.js / Express Products REST API
// Contains 10 intentional bugs for developer assessment

const express = require('express');
const app = express();

let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 15, createdAt: new Date('2024-01-10') },
  { id: 2, name: 'Headphones', price: 79.99, category: 'Electronics', stock: 50, createdAt: new Date('2024-01-15') },
  { id: 3, name: 'Desk Chair', price: 249.99, category: 'Furniture', stock: 8, createdAt: new Date('2024-02-01') },
  { id: 4, name: 'Notebook', price: 4.99, category: 'Stationery', stock: 200, createdAt: new Date('2024-02-10') },
  { id: 5, name: 'Coffee Maker', price: 89.99, category: 'Appliances', stock: 30, createdAt: new Date('2024-03-01') },
];

let nextId = 6;

// ─── ROUTES ─────────────────────────────────────────────

app.get('/products', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category === category);
  }

  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

  if (search) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(result);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'name, price, and category are required' });
  }

  const newProduct = {
    id: nextId++,
    name: name.trim(),
    price: Number(price),
    category,
    stock: stock || 0,
    createdAt: new Date(),
  };

  products.push(newProduct);
  res.status(200).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, category, stock } = req.body;

  product.name = name;
  product.price = price;
  product.category = category;
  product.stock = stock;

  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(index, 1)[0];
  res.json({ massage: 'Product deleted', product: deleted }); 
});

app.get('/products/stats', (req, res) => {
  const total = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgPrice = total > 0 ? products.reduce((s, p) => s + p.price, 0) / total : 0;
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ total, totalValue, avgPrice, categories });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Products API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET    /products');
  console.log('  GET    /products/:id');
  console.log('  POST   /products');
  console.log('  PUT    /products/:id');
  console.log('  DELETE /products/:id');
  console.log('  GET    /products/stats');
});
