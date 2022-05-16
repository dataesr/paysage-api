import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, weblinksField } = config;
const structureWeblinksRepository = new NestedMongoRepository({ db, collection: collectionName, field: weblinksField });

export default structureWeblinksRepository;
