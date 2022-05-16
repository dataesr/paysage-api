import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { collectionName, weblinksField } = config;
const personWeblinksRepository = new NestedMongoRepository({ db, collection: collectionName, field: weblinksField });

export default personWeblinksRepository;
