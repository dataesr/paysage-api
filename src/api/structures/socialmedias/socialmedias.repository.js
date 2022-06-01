import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../structures.config';

const { collection, socialMediasField: field } = config;
const structureSocialMediasRepository = new NestedMongoRepository({ db, collection, field });

export default structureSocialMediasRepository;
