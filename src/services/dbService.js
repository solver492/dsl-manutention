import better_sqlite3 from 'better-sqlite3';

const db = better_sqlite3('database.db');

// Fonction pour obtenir les données des rapports
export const getReportData = async (timeRange) => {
  try {
    // Simuler des données pour le moment
    return {
      revenue: [
        { month: 'Jan', total: 30000 },
        { month: 'Fév', total: 35000 },
        { month: 'Mar', total: 40000 },
        { month: 'Avr', total: 45000 },
        { month: 'Mai', total: 50000 },
        { month: 'Juin', total: 55000 }
      ],
      teamPerformance: [
        { equipe: 'Équipe A', total_prestations: 45 },
        { equipe: 'Équipe B', total_prestations: 38 },
        { equipe: 'Équipe C', total_prestations: 42 }
      ]
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

// Autres fonctions exportées
export const getAllClients = () => {
  const stmt = db.prepare('SELECT * FROM clients');
  return stmt.all();
};

export const createClient = (client) => {
  const stmt = db.prepare('INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)');
  const result = stmt.run(client.nom, client.email, client.telephone);
  return result.lastInsertRowid;
};

export const getAllEmployes = () => {
  const stmt = db.prepare('SELECT * FROM employes');
  return stmt.all();
};

export const createEmploye = (employe) => {
  const stmt = db.prepare('INSERT INTO employes (nom, poste, salaire) VALUES (?, ?, ?)');
  const result = stmt.run(employe.nom, employe.poste, employe.salaire);
  return result.lastInsertRowid;
};

export const getAllPrestations = () => {
  const stmt = db.prepare('SELECT * FROM prestations');
  return stmt.all();
};

export const createPrestation = (prestation) => {
  const stmt = db.prepare('INSERT INTO prestations (type, date, client_id) VALUES (?, ?, ?)');
  const result = stmt.run(prestation.type, prestation.date, prestation.client_id);
  return result.lastInsertRowid;
};