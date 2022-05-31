import mongo from '../../../services/mongo.service';
import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';

const { db } = mongo;
const categoryIdentifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });

export default categoryIdentifiersRepository;
