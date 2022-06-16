import { db } from '../../../services/mongo.service';
import BaseMongoRepository from '../../commons/repositories/base.mongo.repository';

const collection = 'projects';
const projectsRepository = new BaseMongoRepository({ db, collection });

export default projectsRepository;
