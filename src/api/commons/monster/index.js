import db from '../../../services/mongo.service';
import { BaseMongoRepository, Catalogue } from '../../../libs/monster';

const objectCatalogue = new Catalogue({ db, collection: '_catalogue' }, 5);
const internalCatalogue = new Catalogue({ db, collection: '_catalogue' }, 8);
const eventStore = new BaseMongoRepository({ db, collection: '_events' });

export { objectCatalogue, internalCatalogue, eventStore };
