import db from '../../../services/mongo.service';
import { NestedMongoRepository } from '../../../libs/monster';
import config from '../structures.config';

const { collectionName, logosField } = config;
const structureLogosRepository = new NestedMongoRepository({ db, collection: collectionName, field: logosField });

export default structureLogosRepository;
