import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const personsRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default personsRepository;
