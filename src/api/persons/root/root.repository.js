import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { collectionName } = config;
const personsRepository = new BaseMongoRepository({ db, collection: collectionName });

export default personsRepository;
