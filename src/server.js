import express from 'express';
import cors from 'cors';
import { getReportData } from './services/dbService.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/reports', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'last30days';
    const data = await getReportData(timeRange);
    res.json({
      revenue: {
        labels: data.revenue.map(r => r.month),
        datasets: [{
          label: 'Chiffre d\'affaires',
          data: data.revenue.map(r => r.total)
        }]
      },
      services: {
        labels: data.teamPerformance.map(t => t.equipe),
        datasets: [{
          label: 'Prestations par équipe',
          data: data.teamPerformance.map(t => t.total_prestations)
        }]
      },
      satisfaction: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Satisfaction Client',
          data: [4.5, 4.6, 4.7, 4.8, 4.7, 4.9]
        }]
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données des rapports:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});