
import express from 'express';
import cors from 'cors';
import { getAllClients, createClient, getAllEmployes, createEmploye, getAllPrestations, createPrestation, getReportData } from './services/dbService.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes pour les clients
app.get('/api/clients', (req, res) => {
  try {
    const clients = getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const id = createClient(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Employés
app.get('/api/employes', (req, res) => {
  try {
    const employes = getAllEmployes();
    res.json(employes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employes', (req, res) => {
  try {
    const id = createEmploye(req.body);
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes Prestations
app.get('/api/prestations', (req, res) => {
  try {
    const prestations = getAllPrestations();
    res.json(prestations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prestations', (req, res) => {
  try {
    const id = createPrestation(req.body);
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'last30days';
    const data = await getReportData(timeRange);
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données des rapports:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
