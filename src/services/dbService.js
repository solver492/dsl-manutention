
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
  }
};

module.exports = dbService;
