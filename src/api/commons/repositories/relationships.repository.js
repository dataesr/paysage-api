import { db } from '../../../services/mongo.service';
import BaseMongoRepository from './base.mongo.repository';

const relationshipsRepository = new BaseMongoRepository({ db, collection: 'relationships' });

export default relationshipsRepository;
