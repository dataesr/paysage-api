import { db } from '../../../services/mongo.service';
import BaseMongoRepository from '../repositories/base.mongo.repository';

const weblinksRepository = new BaseMongoRepository({ db, collection: 'weblinks' });

export default weblinksRepository;
