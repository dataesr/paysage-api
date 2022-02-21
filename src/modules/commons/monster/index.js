import db from '../../../services/mongo.service';
import { Repository, Catalogue } from '../../../libs/monster';

const objectCatalogue = new Catalogue({ db, collection: '_objects' }, 5);
const internalCatalogue = new Catalogue({ db, collection: '_subobjects' }, 8);
const fileCatalogue = new Catalogue({ db, collection: '_files' }, 12);
const eventStore = new Repository({ db, collection: '_events' });

export { objectCatalogue, internalCatalogue, eventStore, fileCatalogue };
