import mongo from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';

const { db } = mongo;
const categoryIdentifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });

export default categoryIdentifiersRepository;
