
const express = require('express');
const dbService = require('./services/dbService');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Routes pour les clients
app.get('/api/clients', (req, res) => {
  try {
    const clients = dbService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const id = dbService.createClient(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Clients
app.get('/api/clients', (req, res) => {
  const clients = dbService.getAllClients();
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const id = dbService.createClient(req.body);
  res.json({ id });
});

// Routes Employés
app.get('/api/employes', (req, res) => {
  const employes = dbService.getAllEmployes();
  res.json(employes);
});

app.post('/api/employes', (req, res) => {
  const id = dbService.createEmploye(req.body);
  res.json({ id });
});

// Routes Prestations
app.get('/api/prestations', (req, res) => {
  const prestations = dbService.getAllPrestations();
  res.json(prestations);
});

app.post('/api/prestations', (req, res) => {
  const id = dbService.createPrestation(req.body);
  res.json({ id });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
