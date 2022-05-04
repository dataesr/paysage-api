import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './localisations.queries';

const localisations = new Resource(
  { db, collection: 'structures', field: 'localisations', queries },
  { eventStore, catalog },
);

export default localisations;
