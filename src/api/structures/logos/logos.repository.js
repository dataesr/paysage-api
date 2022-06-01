import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../structures.config';

const { collection, logosField: field } = config;
const structureLogosRepository = new NestedMongoRepository({ db, collection, field });

export default structureLogosRepository;
