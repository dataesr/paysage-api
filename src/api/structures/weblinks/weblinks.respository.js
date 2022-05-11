import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureWeblinksRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.weblinksField });

export default structureWeblinksRepository;
