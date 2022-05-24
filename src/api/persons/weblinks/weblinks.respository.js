import mongo from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../config';

const { db } = mongo;
const { collection, weblinksField: field } = config;
const personWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default personWeblinksRepository;
