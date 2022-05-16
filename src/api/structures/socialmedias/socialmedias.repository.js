import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collection, socialMediasField: field } = config;
const structureSocialMediasRepository = new NestedMongoRepository({ db, collection, field });

export default structureSocialMediasRepository;
