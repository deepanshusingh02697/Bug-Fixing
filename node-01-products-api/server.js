// Node.js / Express Products REST API

require('dotenv/config')
const express = require("express");
const app = express();

app.use(express.json());

let products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    stock: 15,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: 2,
    name: "Headphones",
    price: 79.99,
    category: "Electronics",
    stock: 50,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 3,
    name: "Desk Chair",
    price: 249.99,
    category: "Furniture",
    stock: 8,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: 4,
    name: "Notebook",
    price: 4.99,
    category: "Stationery",
    stock: 200,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 89.99,
    category: "Appliances",
    stock: 30,
    createdAt: new Date("2024-03-01"),
  },
];

let nextId = 6;

// ─── ROUTES ─────────────────────────────────────────────

app.get("/products", (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  res.json(result);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.post("/products", (req, res, next) => {
  const { name, price, category, stock } = req.body;
  if (!name || !price || !category) {
    return res
      .status(400)
      .json({ error: "name, price, and category are required" });
  }
  try {
    const newProduct = {
      id: nextId++,
      name: name.trim(),
      price: Number(price),
      category,
      stock: stock || 0,
      createdAt: new Date(),
    };

    products.push(newProduct);
    res.status(201).json({ newProduct, products });
  } catch (error) {
    next(error);
  }
});
app.get("/products/stats", (req, res, next) => {
  const total = products.length;
  console.log(total);
  try {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const avgPrice =
      total > 0 ? products.reduce((s, p) => s + p.price, 0) / total : 0;
    const categories = [...new Set(products.map((p) => p.category))];
    res.json({ total, totalValue, avgPrice, categories });
  } catch (error) {
    console.log(error)
    next(error);
  }
});
app.put("/products/:id", (req, res, next) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  console.log(product);
  console.log(req.body);

  const { name, price, category, stock } = req.body;
  console.log(req.body);

  try {
    for (let key in req.body) {
      product[key] = req.body[key];
    }
    res.status(200).json({ product, products });
  } catch (error) {
    next(error);
  }
});

app.delete("/products/:id", (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === Number(req.params.id));
    console.log("delete element index : ", index);

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    const deleted = products.splice(index, 1)[0];
    res.status(200).json({ message: "Product deleted", product: deleted });
  } catch (error) {
    next(error);
  }
});



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Products API running on http://localhost:${PORT}`);
  console.log("Endpoints:");
  console.log("  GET    /products");
  console.log("  GET    /products/:id");
  console.log("  POST   /products");
  console.log("  PUT    /products/:id");
  console.log("  DELETE /products/:id");
  console.log("  GET    /products/stats");
});
