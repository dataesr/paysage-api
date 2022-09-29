import logger from '../services/logger.service';
import { db } from '../services/mongo.service';

const backupData = async (job, done) => {
  const datasets = [{
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-operateurs-indicateurs-financiers/download/?format=json&timezone=Europe/Berlin&lang=en',
    field: 'resultat_net_comptable',
    fieldName: 'netAccountingResult',
    sortField: 'exercice',
    sortFieldName: 'exercice',
  }, {
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay/download/?format=json&timezone=Europe/Berlin&lang=en',
    field: 'population',
    fieldName: 'population',
    sortField: 'annee_universitaire',
    sortFieldName: 'academicYear',
  }];
  datasets.forEach(async (dataset) => {
    const response = await fetch(dataset.url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
    const data = await response.json();
    const operationsKeyNumbers = data.map((item) => ({
      updateOne: {
        filter: { etablissement_id_paysage: { $eq: item.fields.etablissement_id_paysage } },
        update: { $set: { ...item.fields, id: item.fields.etablissement_id_paysage, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    const uniqueStructure = [];
    const operationsStructures = data
      .sort((a, b) => b[dataset.sortField] - a[dataset.sortField])
      .filter((item) => !uniqueStructure.includes(item.fields.etablissement_id_paysage))
      .map((item) => ({
        updateOne: {
          filter: { etablissement_id_paysage: { $eq: item.fields.etablissement_id_paysage } },
          update: { $set: { [dataset.field]: item[dataset.field], [dataset.sortField]: item[dataset.sortField] } },
        },
      }));
    try {
      await db.collection('keynumbers').bulkWrite(operationsKeyNumbers, { ordered: false });
      await db.collection('structures').bulkWrite(operationsStructures, { ordered: false });
      logger.info('Data setup successful');
      done();
    } catch (e) {
      logger.error({ ...e, message: 'Data setup failed' });
      done();
    }
  });
};

export default backupData;
