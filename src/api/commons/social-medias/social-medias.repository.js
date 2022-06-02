import { db } from '../../../services/mongo.service';
import BaseMongoRepository from '../repositories/base.mongo.repository';

const socialMediasRepository = new BaseMongoRepository({ db, collection: 'social-medias' });

export default socialMediasRepository;
