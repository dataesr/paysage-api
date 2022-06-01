import { db } from '../../../services/mongo.service';
import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';

const categoryIdentifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });

export default categoryIdentifiersRepository;
