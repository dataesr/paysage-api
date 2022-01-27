import BaseRepository from '../commons/repositories/base.repository';
import metas from '../commons/pipelines/metas';

const readModel = [...metas];
const writeModel = [{
  $project: {
    nameFr: 1,
    nameEn: 1,
    descriptionFr: 1,
    descriptionEn: 1,
    parentIds: 1,
    startDate: 1,
    endDate: 1,
  },
}];
const referenceModel = [{
  $project: {
    id: 1,
    nameFr: 1,
    nameEn: 1,
  },
}];

const priceRepository = new BaseRepository({ collection: 'prices', models: { readModel, writeModel, referenceModel } });
console.log('REPO', priceRepository);
export default priceRepository;
