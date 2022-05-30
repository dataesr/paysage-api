import mongo from '../../../services/mongo.service';
import BaseMongoRepository from './base.mongo.repository';

const { db } = mongo;
const relationshipsRepository = new BaseMongoRepository({ db, collection: 'relationships' });

export default relationshipsRepository;
