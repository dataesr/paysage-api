import logger from '../services/logger.service';
import { db } from '../services/mongo.service';

const backupData = async (job, done) => {
  logger.info('Backup data');
  const datasets = [{
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-operateurs-indicateurs-financiers/download/?format=json&timezone=Europe/Berlin&lang=en',
    field: 'resultat_net_comptable',
    fieldName: 'netAccountingResult',
    paysageId: 'etablissement_id_paysage',
    sortField: 'exercice',
    sortFieldName: 'exercice',
  }, {
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay/download/?format=json&timezone=Europe/Berlin&lang=en',
    field: 'effectif',
    fieldName: 'population',
    paysageId: 'etablissement_id_paysage',
    sortField: 'annee_universitaire',
    sortFieldName: 'academicYear',
  }, {
    url: 'https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-patrimoine-immobilier-des-operateurs-de-l-enseignement-superieur/download/?format=json&timezone=Europe/Berlin&lang=en',
    paysageId: 'paysage_id',
  }];
  datasets.forEach(async (dataset) => {
    const response = await fetch(dataset.url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
    const data = await response.json();
    const operationsKeyNumbers = data?.length && data.map((item) => {
      const ids = item.fields[dataset.paysageId].split(',');
      return ids.map((id) => ({
        updateOne: {
          filter: { id: { $eq: id } },
          update: { $set: { ...item.fields, id, resourceId: id, updatedAt: new Date() } },
          upsert: true,
        },
      }));
    });
    let operationsStructures = false;
    if (dataset?.field) {
      const uniqueStructures = [];
      operationsStructures = data?.length && data
        .sort((a, b) => (parseInt((b.fields[dataset.sortField]).slice(0, 4), 10) - parseInt((a.fields[dataset.sortField]).slice(0, 4), 10)))
        .filter((item) => {
          if (!uniqueStructures.includes(item.fields[dataset.paysageId])) {
            uniqueStructures.push(item.fields[dataset.paysageId]);
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
                filter: { id: { $eq: item.fields[dataset.paysageId] } },
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
