import { db } from '../../../services/mongo.service';
import BaseMongoRepository from '../repositories/base.mongo.repository';

const identifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });

export default identifiersRepository;
