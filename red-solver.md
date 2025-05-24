
# Architecture de la Base de Données - Mon Auxiliaire Déménagement

## Technologies Utilisées

### Frontend
- React 18.2.0 avec Vite
- TailwindCSS pour le styling
- Radix UI pour les composants
- Framer Motion pour les animations

### Stockage de Données (État Actuel)
- Actuellement, l'application utilise le `localStorage` du navigateur pour simuler une base de données
- Cette solution est temporaire et destinée uniquement à des fins de démonstration

### Recommandation pour la Production
- **Supabase** est recommandé comme solution de base de données
  - Base PostgreSQL hautement évolutive
  - API REST et temps réel intégrée
  - Authentification et autorisation intégrées
  - Compatible avec le déploiement sur Replit

## Structure de la Base de Données

### Tables Principales

#### 1. Clients
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    adresse TEXT,
    email VARCHAR(255),
    telephone VARCHAR(20),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Employés
```sql
CREATE TABLE employes (
    id UUID PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    poste VARCHAR(50),
    equipe VARCHAR(50),
    nb_manutentionnaires_equipe INTEGER,
    disponibilite VARCHAR(20),
    salaire_journalier DECIMAL(10,2),
    telephone VARCHAR(20)
);
```

#### 3. Véhicules
```sql
CREATE TABLE vehicules (
    id UUID PRIMARY KEY,
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50),
    etat VARCHAR(20),
    capacite VARCHAR(20),
    prochaine_maintenance DATE
);
```

#### 4. Prestations
```sql
CREATE TABLE prestations (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    date_prestation DATE NOT NULL,
    adresse_depart TEXT NOT NULL,
    adresse_arrivee TEXT NOT NULL,
    statut VARCHAR(20),
    prix_ht DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Factures
```sql
CREATE TABLE factures (
    id UUID PRIMARY KEY,
    prestation_id UUID REFERENCES prestations(id),
    montant_ht DECIMAL(10,2) NOT NULL,
    tva DECIMAL(10,2) NOT NULL,
    montant_ttc DECIMAL(10,2) NOT NULL,
    date_emission DATE NOT NULL,
    date_echeance DATE NOT NULL,
    statut VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tables de Relations

#### 1. Prestation_Employes
```sql
CREATE TABLE prestation_employes (
    prestation_id UUID REFERENCES prestations(id),
    employe_id UUID REFERENCES employes(id),
    PRIMARY KEY (prestation_id, employe_id)
);
```

#### 2. Prestation_Vehicules
```sql
CREATE TABLE prestation_vehicules (
    prestation_id UUID REFERENCES prestations(id),
    vehicule_id UUID REFERENCES vehicules(id),
    PRIMARY KEY (prestation_id, vehicule_id)
);
```

## Avantages de l'Architecture Proposée

1. **Intégrité des Données**
   - Relations bien définies entre les tables
   - Contraintes de clés étrangères pour maintenir la cohérence
   - Pas de duplication inutile des données

2. **Scalabilité**
   - Structure optimisée pour la croissance
   - Indexes sur les colonnes fréquemment utilisées
   - Support des requêtes complexes

3. **Sécurité**
   - Authentification robuste via Supabase
   - Contrôle d'accès granulaire
   - Chiffrement des données sensibles

4. **Performance**
   - Requêtes optimisées
   - Cache intégré avec Supabase
   - Temps réel pour les mises à jour

## Migration Recommandée

1. **Étapes de Migration**
   - Créer un projet Supabase sur Replit
   - Exécuter les scripts de création de tables
   - Migrer les données du localStorage
   - Mettre à jour les composants React

2. **Maintenance**
   - Sauvegardes automatiques
   - Monitoring des performances
   - Mises à jour de sécurité

## Bonnes Pratiques

1. **Indexation**
   - Index sur les colonnes de recherche fréquente
   - Index sur les clés étrangères
   - Index composites pour les requêtes complexes

2. **Sécurité**
   - Utilisation de UUID pour les IDs
   - Validation des entrées
   - Contrôle d'accès par rôle

3. **Performance**
   - Pagination des résultats
   - Requêtes optimisées
   - Cache approprié
