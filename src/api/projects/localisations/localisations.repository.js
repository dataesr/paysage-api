import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';

const projectLocalisationsRepository = new NestedMongoRepository({ db, collection: 'projects', field: 'localisations' });

export default projectLocalisationsRepository;
