import mongo from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { db } = mongo;
const { collection, weblinksField: field } = config;
const structureWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default structureWeblinksRepository;
