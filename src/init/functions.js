/* eslint-disable no-console */
import axios from 'axios';
import mongodb from 'mongodb';

const MONGO_URI = '';
const MONGO_DBNAME = 'paysage-devj';

async function getAllStructuresIds() {
  // => Récupération de l'objet globalpaysage V1
  console.log("Récupération de l'objet global ...");

  // Récupération via fichier json
  const allObjects = await axios.get(
    'https://paysage.mesri.fr/json/Objets.json',
  );

  // Filtre sur les structures uniquement
  return Object.values(allObjects?.data)
    .filter((obj) => obj?.attribute_5 === 'Structure')
    .map((structure) => structure.token);

  // Récupération via ODS (mise à jour toutes les heures)
  // eslint-disable-next-line max-len
  // https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-objets-paysage&q=&facet=attribute_5&facet=etat&facet=attribute_26&facet=token&facet=attribute_33&facet=attribute_52&facet=attribute_41&facet=attribute_53&facet=attribute_46&facet=attribute_43&facet=attribute_6&facet=attribute_42&facet=attribute_40&facet=attribute_4&facet=attribute_13&facet=attribute_54&facet=attribute_17&facet=attribute_18&facet=attribute_19&facet=attribute_20&facet=attribute_21&facet=attribute_10&facet=attribute_11&facet=attribute_3&facet=attribute_31&facet=attribute_78
}

async function connect() {
  const client = new mongodb.MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`=> Try to connect to mongo... ${MONGO_URI}`);

  client.connect().catch((e) => {
    console.log('error', e);
    process.kill(process.pid, 'SIGTERM');
  });

  const db = client.db(MONGO_DBNAME);

  return { client, db };
}

export default { getAllStructuresIds, connect };
