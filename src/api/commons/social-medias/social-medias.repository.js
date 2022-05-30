import mongo from '../../../services/mongo.service';
import { BaseMongoRepository } from '../../../libs/monster';

const { db } = mongo;
const socialMediasRepository = new BaseMongoRepository({ db, collection: 'social-medias' });

export default socialMediasRepository;
