# CovidCompare

## Présentation du projet

**CovidCompare** est une application web développée avec **React** permettant de comparer les statistiques liées au **COVID-19** entre deux pays (ou plus).  
Le projet utilise une **API REST open-source** afin d’afficher des données réelles de manière claire et interactive.

Ce projet a été réalisé dans un cadre pédagogique.

---

## Objectifs pédagogiques

- Apprendre à consommer une **API REST open-source**
- Utiliser les **hooks React** (`useState`, `useEffect`)
- Créer une **interface utilisateur interactive**
- Comparer et analyser des données dynamiques
- Visualiser des données avec des **graphiques**
- Mettre en place des **filtres et sélections dynamiques**

---

## Fonctionnalités

- Sélection de **deux pays** via un menu déroulant
- Affichage des statistiques pour chaque pays :
  - Cas totaux
  - Cas actifs
  - Décès
  - Vaccinations
- Graphiques comparatifs pour visualiser les différences
- Affichage de la **date de dernière mise à jour**

---

## Technologies utilisées

### Frontend
- **React**
  - Composants fonctionnels
  - Hooks

### API
- **disease.sh** (API COVID-19 open-source)

### UI & Visualisation
- **Chart.js** via `react-chartjs-2`
- **TailwindCSS / Sass / CSS** (au choix)
- Librairies d’icônes (optionnel)

### Description des composants

- **CountrySelector**  
  Menu déroulant pour sélectionner les pays

- **CountryStats**  
  Carte affichant les statistiques d’un pays

- **ComparisonChart**  
  Graphique comparatif entre les pays sélectionnés

- **CovidAPI.js**  
  Service chargé de récupérer les données depuis l’API `disease.sh`

---

## 👥 Équipe du projet

Projet réalisé par **Andy**, **Abdulrahman** et **Lucas**
