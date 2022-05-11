import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../persons.config';

const personSocialMediasRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.socialMediasField });

export default personSocialMediasRepository;
