import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const structureLogosRepository = new NestedMongoRepository({ db, collection: config.collectionName, field: config.logosField });

export default structureLogosRepository;
