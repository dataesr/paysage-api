import db from '../../services/mongo.service';
import { BaseMongoRepository } from '../../libs/monster';
import config from './terms.config';

const { collectionName } = config;
const termsRepository = new BaseMongoRepository({ db, collection: collectionName });

export default termsRepository;
