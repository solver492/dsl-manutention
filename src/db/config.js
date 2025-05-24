
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new Database(path.join(__dirname, 'database.sqlite'), { verbose: console.log });

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    adresse TEXT,
    email TEXT,
    telephone TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS employes (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    poste TEXT,
    equipe TEXT,
    nb_manutentionnaires_equipe INTEGER,
    disponibilite TEXT,
    salaire_journalier DECIMAL(10,2),
    telephone TEXT
  );

  CREATE TABLE IF NOT EXISTS vehicules (
    id TEXT PRIMARY KEY,
    immatriculation TEXT UNIQUE NOT NULL,
    type TEXT,
    etat TEXT,
    capacite TEXT,
    prochaine_maintenance DATE
  );

  CREATE TABLE IF NOT EXISTS prestations (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    date_prestation DATE NOT NULL,
    adresse_depart TEXT NOT NULL,
    adresse_arrivee TEXT NOT NULL,
    statut TEXT,
    prix_ht DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS factures (
    id TEXT PRIMARY KEY,
    prestation_id TEXT,
    montant_ht DECIMAL(10,2) NOT NULL,
    tva DECIMAL(10,2) NOT NULL,
    montant_ttc DECIMAL(10,2) NOT NULL,
    date_emission DATE NOT NULL,
    date_echeance DATE NOT NULL,
    statut TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prestation_id) REFERENCES prestations(id)
  );

  CREATE TABLE IF NOT EXISTS prestation_employes (
    prestation_id TEXT,
    employe_id TEXT,
    PRIMARY KEY (prestation_id, employe_id),
    FOREIGN KEY(prestation_id) REFERENCES prestations(id),
    FOREIGN KEY(employe_id) REFERENCES employes(id)
  );

  CREATE TABLE IF NOT EXISTS prestation_vehicules (
    prestation_id TEXT,
    vehicule_id TEXT,
    PRIMARY KEY (prestation_id, vehicule_id),
    FOREIGN KEY(prestation_id) REFERENCES prestations(id),
    FOREIGN KEY(vehicule_id) REFERENCES vehicules(id)
  );
`);

module.exports = db;
