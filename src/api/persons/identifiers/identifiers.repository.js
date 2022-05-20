import mongo from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';

const { db } = mongo;
const personIdentifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });

export default personIdentifiersRepository;
