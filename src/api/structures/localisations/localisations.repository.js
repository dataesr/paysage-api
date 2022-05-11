import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureLocalisationsRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.localisationsField });

export default structureLocalisationsRepository;
