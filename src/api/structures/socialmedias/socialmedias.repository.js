import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureSocialMediasRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.socialMediasField });

export default structureSocialMediasRepository;
