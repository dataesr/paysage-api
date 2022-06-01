import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../persons.config';

const { collection, weblinksField: field } = config;
const personWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default personWeblinksRepository;
