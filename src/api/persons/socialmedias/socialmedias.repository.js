import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const { collectionName, socialMediasField } = config;
const personSocialMediasRepository = new NestedMongoRepository({ db, collection: collectionName, field: socialMediasField });

export default personSocialMediasRepository;
