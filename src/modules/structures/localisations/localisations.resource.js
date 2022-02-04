import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './localisations.queries';

const localisations = new Resource(
  { db, collection: 'structures', field: 'localisations', queries },
  { eventStore, catalogue },
);

export default localisations;
