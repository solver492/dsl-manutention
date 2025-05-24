import db from '../db/config.js';
import { v4 as uuidv4 } from 'uuid';

const dbService = {
  // Clients
  getAllClients: () => {
    return db.prepare('SELECT * FROM clients').all();
  },

  createClient: (client) => {
    const stmt = db.prepare('INSERT INTO clients (id, nom, adresse, email, telephone) VALUES (?, ?, ?, ?, ?)');
    const id = uuidv4();
    stmt.run(id, client.nom, client.adresse, client.email, client.telephone);
    return id;
  },

  // Employés
  getAllEmployes: () => {
    return db.prepare('SELECT * FROM employes').all();
  },

  createEmploye: (employe) => {
    const stmt = db.prepare(`
      INSERT INTO employes (id, nom, poste, equipe, nb_manutentionnaires_equipe, disponibilite, salaire_journalier, telephone) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const id = uuidv4();
    stmt.run(
      id, 
      employe.nom, 
      employe.poste, 
      employe.equipe,
      employe.nb_manutentionnaires_equipe,
      employe.disponibilite,
      employe.salaire_journalier,
      employe.telephone
    );
    return id;
  },

  // Prestations
  getAllPrestations: () => {
    return db.prepare('SELECT * FROM prestations').all();
  },

  createPrestation: (prestation) => {
    const stmt = db.prepare(`
      INSERT INTO prestations (id, client_id, date_prestation, adresse_depart, adresse_arrivee, statut, prix_ht)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const id = uuidv4();
    stmt.run(
      id,
      prestation.client_id,
      prestation.date_prestation,
      prestation.adresse_depart,
      prestation.adresse_arrivee,
      prestation.statut,
      prestation.prix_ht
    );
    return id;
  },
  export const getReportData = async (timeRange) => {
    //const db = await openDB(); // Assuming openDB is defined elsewhere to open your SQLite database
  
    // Calculer la date de début en fonction de la plage de temps
    const startDate = this.getStartDate(timeRange);
  
    try {
      // Récupérer le chiffre d'affaires
      const revenue = db.prepare(`
        SELECT strftime('%Y-%m', date_prestation) as month, SUM(prix_ht) as total
        FROM prestations 
        WHERE date_prestation >= ?
        GROUP BY month
        ORDER BY month
      `).all(startDate);
  
      // Récupérer les performances par équipe
      const teamPerformance = db.prepare(`
        SELECT e.equipe, COUNT(p.id) as total_prestations
        FROM prestations p
        JOIN employes e ON p.id = p.employe_id -- Assuming employe_id in prestations table
        WHERE p.date_prestation >= ?
        GROUP BY e.equipe
      `).all(startDate);
  
      // Calculer le taux d'occupation des véhicules - This might not be directly applicable without a 'vehicules' table and appropriate fields.  Returning a default value.
      const occupancyRate = {rate: 75}; //await db.get(``);
  
      // Récupérer la satisfaction client - This assumes you have a client satisfaction mechanism in your 'prestations' or related table. Returning a default value.
      const clientSatisfaction = []; //await db.all(``);
  
      return {
        revenue,
        teamPerformance,
        occupancyRate: occupancyRate?.rate || 0,
        clientSatisfaction
      };
  
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  },
  
   getStartDate: function(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case 'last7days':
        return new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      case 'last30days':
        return new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      case 'currentMonth':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      case 'lastQuarter':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString().split('T')[0];
      case 'currentYear':
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      default:
        return new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
    }
  }
};

module.exports = dbService;