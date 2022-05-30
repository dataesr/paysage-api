import mongo from '../../../services/mongo.service';
import NestedMongoRepository from '../../commons/repositories/nested.mongo.repository';
import config from '../categories.config';

const { db } = mongo;
const { collection, weblinksField: field } = config;
const categoryWeblinksRepository = new NestedMongoRepository({ db, collection, field });

export default categoryWeblinksRepository;
