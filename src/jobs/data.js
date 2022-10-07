import logger from '../services/logger.service';
import { db } from '../services/mongo.service';

const backupData = async (job, done) => {
  logger.info('Backup data');
  const datasets = [{
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-operateurs-indicateurs-financiers/download/?format=json&timezone=Europe/Berlin&lang=en',
    datasetName: 'finance',
    field: 'resultat_net_comptable',
    fieldName: 'netAccountingResult',
    paysageIdField: 'etablissement_id_paysage',
    sortField: 'exercice',
    sortFieldName: 'exercice',
  }, {
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay/download/?format=json&timezone=Europe/Berlin&lang=en',
    datasetName: 'population',
    field: 'effectif',
    fieldName: 'population',
    paysageIdField: 'etablissement_id_paysage',
    sortField: 'annee_universitaire',
    sortFieldName: 'academicYear',
  }, {
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-patrimoine-immobilier-des-operateurs-de-l-enseignement-superieur/download/?format=json&timezone=Europe/Berlin&lang=en',
    datasetName: 'real-estate',
    paysageIdField: 'paysage_id',
  }];
  datasets.forEach(async (dataset) => {
    const response = await fetch(dataset.url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
    const data = await response.json();
    const operationsKeyNumbers = data?.length && data
      // Check that the paysage id is set
      .filter((item) => item?.fields?.[dataset?.paysageIdField])
      .map((item) => {
        // Split paysage ids if multi-valuated
        const paysageIds = item.fields[dataset.paysageIdField].split(',');
        return paysageIds.map((paysageId) => ({
          updateOne: {
            filter: { id: { $eq: item.recordid } },
            update: { $set: { ...item.fields, id: item.recordid, dataset: dataset.datasetName, resourceId: paysageId, updatedAt: new Date() } },
            upsert: true,
          },
        }));
      }).flat();
    let operationsStructures = false;
    if (dataset?.field) {
      const uniqueStructures = [];
      operationsStructures = data?.length && data
        .sort((a, b) => (parseInt((b.fields[dataset.sortField]).slice(0, 4), 10) - parseInt((a.fields[dataset.sortField]).slice(0, 4), 10)))
        .filter((item) => {
          if (!uniqueStructures.includes(item.fields[dataset.paysageIdField])) {
            uniqueStructures.push(item.fields[dataset.paysageIdField]);
            return item;
          }
          return false;
        })
        .map((item) => {
          const set = {};
          if (dataset && dataset?.field && item && item?.fields?.[dataset.field]) set[dataset.fieldName] = item.fields[dataset.field];
          if (dataset && dataset?.sortField && item && item?.fields?.[dataset.sortField]) set[dataset.sortFieldName] = item.fields[dataset.sortField];
          if (Object.keys(set).length > 0) {
            return {
              updateOne: {
                filter: { id: { $eq: item.fields[dataset.paysageIdField] } },
                update: { $set: set },
              },
            };
          }
          return {};
        });
    }
    try {
      await db.collection('keynumbers').bulkWrite(operationsKeyNumbers, { ordered: false });
      if (operationsStructures) {
        await db.collection('structures').bulkWrite(operationsStructures, { ordered: false });
      }
      logger.info('Data setup successful');
      done();
    } catch (e) {
      logger.error({ message: 'Data setup failed' });
      logger.error(e);
      done();
    }
  });
};

export default backupData;
