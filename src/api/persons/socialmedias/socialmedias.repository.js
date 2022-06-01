import { db } from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../persons.config';

const { collection, socialMediasField: field } = config;
const personSocialMediasRepository = new NestedMongoRepository({ db, collection, field });

export default personSocialMediasRepository;
