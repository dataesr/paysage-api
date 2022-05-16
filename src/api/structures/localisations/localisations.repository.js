import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, localisationsField } = config;
const structureLocalisationsRepository = new NestedMongoRepository({ db, collection: collectionName, field: localisationsField });

export default structureLocalisationsRepository;
