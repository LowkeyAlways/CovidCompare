// Script de test pour l'API COVID
// Exécute avec: node test-api.mjs

import * as covidApi from './src/services/covidApi.ts';

console.log('🧪 Démarrage des tests API...\n');

// Test 1: Récupérer les pays
console.log('📍 Test 1: Récupérer la liste des pays');
const countries = await covidApi.fetchCountries();
if (countries.success) {
  console.log(`✅ ${countries.data?.length} pays récupérés`);
  console.log(`   Premiers pays: ${countries.data?.slice(0, 3).map(c => c.name).join(', ')}\n`);
} else {
  console.log(`❌ Erreur: ${countries.error}\n`);
}

// Test 2: Récupérer les stats de la France
console.log('🇫🇷 Test 2: Récupérer les stats de la France');
const france = await covidApi.fetchCountryStats('france');
if (france.success) {
  console.log(`✅ Cas: ${france.data?.cases}`);
  console.log(`   Décès: ${france.data?.deaths}`);
  console.log(`   Rétablis: ${france.data?.recovered}\n`);
} else {
  console.log(`❌ Erreur: ${france.error}\n`);
}

// Test 3: Récupérer les stats des USA
console.log('🇺🇸 Test 3: Récupérer les stats des USA');
const usa = await covidApi.fetchCountryStats('usa');
if (usa.success) {
  console.log(`✅ Cas: ${usa.data?.cases}`);
  console.log(`   Décès: ${usa.data?.deaths}`);
  console.log(`   Rétablis: ${usa.data?.recovered}\n`);
} else {
  console.log(`❌ Erreur: ${usa.error}\n`);
}

// Test 4: Récupérer les données historiques (30 jours)
console.log('📊 Test 4: Récupérer les données historiques (30 jours)');
const historical = await covidApi.fetchHistoricalData('france', 30);
if (historical.success) {
  const dates = Object.keys(historical.data?.timeline.cases || {});
  console.log(`✅ ${dates.length} jours de données récupérés`);
  console.log(`   Premiers jours: ${dates.slice(0, 3).join(', ')}\n`);
} else {
  console.log(`❌ Erreur: ${historical.error}\n`);
}

console.log('✨ Tests terminés!');
