import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, socialMediasField } = config;
const structureSocialMediasRepository = new NestedMongoRepository({ db, collection: collectionName, field: socialMediasField });

export default structureSocialMediasRepository;
