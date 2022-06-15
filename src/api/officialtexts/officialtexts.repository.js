import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';

export default new BaseMongoRepository({ db, collection: 'official-texts' });
