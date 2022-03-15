import db from '../../../services/mongo.service';
import { Repository, Catalogue } from '../../../libs/monster';

const objectCatalogue = new Catalogue({ db, collection: '_catalogue' }, 5);
const internalCatalogue = new Catalogue({ db, collection: '_catalogue' }, 8);
const eventStore = new Repository({ db, collection: '_events' });

export { objectCatalogue, internalCatalogue, eventStore };
