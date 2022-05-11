import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const personWeblinksRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.weblinksField });

export default personWeblinksRepository;
