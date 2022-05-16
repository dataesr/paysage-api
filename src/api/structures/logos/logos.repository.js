import mongo from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { db } = mongo;
const { collection, logosField: field } = config;
const structureLogosRepository = new NestedMongoRepository({ db, collection, field });

export default structureLogosRepository;
