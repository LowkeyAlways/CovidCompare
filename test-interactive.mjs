// Test interactif de l'API COVID
// Exécute avec: node test-interactive.mjs

import * as readline from 'readline';
import * as covidApi from './src/services/covidApi.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('╔════════════════════════════════════════╗');
console.log('║   🦠 Test Interactif API COVID-19    ║');
console.log('╚════════════════════════════════════════╝\n');

function showMenu() {
  console.log('\n📋 Que veux-tu faire ?');
  console.log('  1 - Voir la liste des pays');
  console.log('  2 - Chercher les stats d\'un pays');
  console.log('  3 - Voir l\'historique d\'un pays (30 jours)');
  console.log('  4 - Comparer deux pays');
  console.log('  0 - Quitter\n');
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function listCountries() {
  console.log('\n🌍 Récupération de la liste des pays...\n');
  const result = await covidApi.fetchCountries();
  
  if (result.success && result.data) {
    console.log(`✅ ${result.data.length} pays disponibles:\n`);
    result.data.slice(0, 20).forEach((country, i) => {
      console.log(`   ${i + 1}. ${country.name} (${country.code})`);
    });
    console.log(`\n   ... et ${result.data.length - 20} autres pays`);
  } else {
    console.log(`❌ Erreur: ${result.error}`);
  }
}

async function getCountryStats() {
  const country = await ask('\n🔍 Entre le nom du pays (ex: france, usa, morocco): ');
  
  if (!country.trim()) {
    console.log('❌ Nom de pays requis!');
    return;
  }
  
  console.log(`\n📊 Récupération des stats pour ${country}...\n`);
  const result = await covidApi.fetchCountryStats(country.trim());
  
  if (result.success && result.data) {
    const d = result.data;
    console.log('┌─────────────────────────────────────────┐');
    console.log(`│  🏳️  ${d.country.padEnd(37)}│`);
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  📈 Cas totaux:      ${d.cases.toLocaleString().padStart(15)} │`);
    console.log(`│  📊 Cas actifs:      ${d.active.toLocaleString().padStart(15)} │`);
    console.log(`│  ☠️  Décès:          ${d.deaths.toLocaleString().padStart(15)} │`);
    console.log(`│  💚 Rétablis:        ${d.recovered.toLocaleString().padStart(15)} │`);
    console.log(`│  🔬 Tests:           ${d.tests.toLocaleString().padStart(15)} │`);
    console.log(`│  👥 Population:      ${d.population.toLocaleString().padStart(15)} │`);
    console.log('└─────────────────────────────────────────┘');
    
    const updateDate = new Date(d.updated);
    console.log(`\n🕐 Dernière mise à jour: ${updateDate.toLocaleString()}`);
  } else {
    console.log(`❌ Erreur: ${result.error}`);
  }
}

async function getHistoricalData() {
  const country = await ask('\n🔍 Entre le nom du pays: ');
  
  if (!country.trim()) {
    console.log('❌ Nom de pays requis!');
    return;
  }
  
  console.log(`\n📈 Récupération de l'historique pour ${country}...\n`);
  const result = await covidApi.fetchHistoricalData(country.trim(), 30);
  
  if (result.success && result.data) {
    const timeline = result.data.timeline;
    const dates = Object.keys(timeline.cases);
    
    console.log(`✅ Données des ${dates.length} derniers jours:\n`);
    
    // Afficher les 5 derniers jours
    dates.slice(-5).forEach(date => {
      const cases = timeline.cases[date];
      const deaths = timeline.deaths[date];
      console.log(`   📅 ${date.padEnd(12)} - Cas: ${cases.toLocaleString().padStart(12)} | Décès: ${deaths.toLocaleString().padStart(10)}`);
    });
  } else {
    console.log(`❌ Erreur: ${result.error}`);
  }
}

async function compareTwoCountries() {
  const country1 = await ask('\n🔍 Premier pays: ');
  const country2 = await ask('🔍 Deuxième pays: ');
  
  if (!country1.trim() || !country2.trim()) {
    console.log('❌ Les deux pays sont requis!');
    return;
  }
  
  console.log(`\n⚖️  Comparaison ${country1} vs ${country2}...\n`);
  
  const [result1, result2] = await Promise.all([
    covidApi.fetchCountryStats(country1.trim()),
    covidApi.fetchCountryStats(country2.trim())
  ]);
  
  if (result1.success && result2.success && result1.data && result2.data) {
    const d1 = result1.data;
    const d2 = result2.data;
    
    console.log('┌────────────────────────┬──────────────────┬──────────────────┐');
    console.log(`│ Statistique            │ ${d1.country.padEnd(16)} │ ${d2.country.padEnd(16)} │`);
    console.log('├────────────────────────┼──────────────────┼──────────────────┤');
    console.log(`│ 📈 Cas totaux          │ ${d1.cases.toLocaleString().padStart(16)} │ ${d2.cases.toLocaleString().padStart(16)} │`);
    console.log(`│ 📊 Cas actifs          │ ${d1.active.toLocaleString().padStart(16)} │ ${d2.active.toLocaleString().padStart(16)} │`);
    console.log(`│ ☠️  Décès              │ ${d1.deaths.toLocaleString().padStart(16)} │ ${d2.deaths.toLocaleString().padStart(16)} │`);
    console.log(`│ 💚 Rétablis            │ ${d1.recovered.toLocaleString().padStart(16)} │ ${d2.recovered.toLocaleString().padStart(16)} │`);
    console.log(`│ 👥 Population          │ ${d1.population.toLocaleString().padStart(16)} │ ${d2.population.toLocaleString().padStart(16)} │`);
    console.log('└────────────────────────┴──────────────────┴──────────────────┘');
  } else {
    console.log(`❌ Erreur lors de la récupération des données`);
  }
}

async function main() {
  let running = true;
  
  while (running) {
    showMenu();
    const choice = await ask('👉 Ton choix: ');
    
    switch (choice.trim()) {
      case '1':
        await listCountries();
        break;
      case '2':
        await getCountryStats();
        break;
      case '3':
        await getHistoricalData();
        break;
      case '4':
        await compareTwoCountries();
        break;
      case '0':
        console.log('\n👋 À bientôt!\n');
        running = false;
        break;
      default:
        console.log('\n❌ Choix invalide, réessaye!');
    }
  }
  
  rl.close();
}

main();
