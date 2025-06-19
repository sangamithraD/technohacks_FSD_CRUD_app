const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

let items = [];
let nextId = 1;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all tasks
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Add a new task
app.post('/api/items', (req, res) => {
  const newItem = { id: nextId++, name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update a task
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  if (item) {
    item.name = req.body.name;
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Delete a task
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(item => item.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
