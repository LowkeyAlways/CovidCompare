import { fetchCountries, fetchCountryStats, fetchHistoricalData } from './src/services/covidApi.js';

async function runTests() {
  console.log('🧪 Test 1: Récupérer la liste des pays...');
  const countries = await fetchCountries();
  console.log(countries.success ? '✅ Succès' : '❌ Erreur');
  if (countries.success && countries.data) {
    console.log(`   Nombre de pays: ${countries.data.length}`);
    console.log(`   Premiers pays: ${countries.data.slice(0, 3).map(c => c.name).join(', ')}`);
  }

  console.log('\n🧪 Test 2: Récupérer les stats de la France...');
  const france = await fetchCountryStats('france');
  console.log(france.success ? '✅ Succès' : '❌ Erreur');
  if (france.success && france.data) {
    console.log(`   Cas: ${france.data.cases}`);
    console.log(`   Décès: ${france.data.deaths}`);
  }

  console.log('\n🧪 Test 3: Récupérer les données historiques (30 jours)...');
  const history = await fetchHistoricalData('france', 30);
  console.log(history.success ? '✅ Succès' : '❌ Erreur');
  if (history.success && history.data) {
    console.log(`   Nombre de jours: ${Object.keys(history.data.timeline.cases).length}`);
  }

  console.log('\n✨ Tests terminés!');
}

runTests().catch(console.error);
