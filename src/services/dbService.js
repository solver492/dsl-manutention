import better_sqlite3 from 'better-sqlite3';

const db = better_sqlite3('database.db');

// Fonction pour obtenir les données des rapports
export const getReportData = async (timeRange) => {
  try {
    const prestations = await getAllPrestations();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    
    // Calculer le chiffre d'affaires par mois
    const revenue = months.map(month => {
      const total = prestations
        .filter(p => new Date(p.date).toLocaleString('fr-FR', { month: 'short' }) === month)
        .reduce((sum, p) => sum + (p.montant || 0), 0);
      return { month, total };
    });

    // Calculer les performances par équipe
    const teams = [...new Set(prestations.map(p => p.equipe))];
    const teamPerformance = teams.map(equipe => ({
      equipe,
      total_prestations: prestations.filter(p => p.equipe === equipe).length
    }));

    return {
      revenue,
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