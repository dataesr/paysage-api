import logger from '../services/logger.service';
import { db } from '../services/mongo.service';

const backupData = async () => {
  const urls = [
    'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-operateurs-indicateurs-financiers/download/?format=json&timezone=Europe/Berlin&lang=en',
    'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay/download/?format=json&timezone=Europe/Berlin&lang=en',
  ];
  urls.forEach(async (url) => {
    const response = await fetch(url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
    const data = await response.json();
    const operations = data.map((item) => ({
      updateOne: {
        filter: { etablissement_id_paysage: { $eq: item.fields.etablissement_id_paysage } },
        update: { $set: { ...item.fields, id: item.fields.etablissement_id_paysage, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    try {
      await db.collection('keynumbers').bulkWrite(operations, { ordered: false });
      logger.info('Data setup successful');
      process.exit(0);
    } catch (e) {
      logger.error({ ...e, message: 'Data setup failed' });
      process.exit(1);
    }
  });
};

export default backupData;
