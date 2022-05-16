import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const { collectionName, weblinksField } = config;
const categoryWeblinksRepository = new NestedMongoRepository({ db, collection: collectionName, field: weblinksField });

export default categoryWeblinksRepository;
