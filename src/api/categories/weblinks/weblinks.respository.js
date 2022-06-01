import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../categories.config';

const { collection, weblinksField: field } = config;
const categoryWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default categoryWeblinksRepository;
