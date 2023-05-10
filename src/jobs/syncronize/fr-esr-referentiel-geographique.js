import { client, db } from '../../services/mongo.service';

async function downloadDataset() {
  const url = 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-referentiel-geographique/download/?format=json';
  const options = { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data?.map((row) => row.fields) || [];
  } catch { return []; }
}

export default async function syncronizeFrEsrReferentielGeographique(job) {
  const data = await downloadDataset();
  if (!data?.length) return 'La syncronisation a échouée: Echec du téléchargement des données';
  let result = "La syncronisation s'est terminée avec succès";
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('geocodes').deleteMany({});
    await db.collection('geocodes').insertMany(data);
    await session.endSession();
  }).catch((e) => {
    job.fail(`La syncronisation a échouée: ${e.message}`);
    result = null;
  });
  return result;
}
