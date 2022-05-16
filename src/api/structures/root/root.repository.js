import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName } = config;
const structuresRepository = new BaseMongoRepository({ db, collection: collectionName });

export default structuresRepository;
