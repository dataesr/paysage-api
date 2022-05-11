import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../categories.config';

const categoryWeblinksRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.weblinksField });

export default categoryWeblinksRepository;
