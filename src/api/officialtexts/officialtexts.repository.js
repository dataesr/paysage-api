import { db } from '../../services/mongo.service';
import BaseMongoRepository from '../commons/repositories/base.mongo.repository';
import config from './officialtexts.config';

const { collection } = config;
const officialTextsRepository = new BaseMongoRepository({ db, collection });

export default officialTextsRepository;
