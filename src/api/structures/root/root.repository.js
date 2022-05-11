import db from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structuresRepository = new BaseMongoRepository({ db, collection: config.collectionName });

export default structuresRepository;
