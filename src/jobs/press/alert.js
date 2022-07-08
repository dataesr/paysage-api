import { db } from '../../services/mongo.service';
// import elastic from '../../services/elastic.service';
import {
  parseAef,
  parseNewsTank,
  parseFigaro,
  parseEducPro,
  parseEducProPersonalites,
  parseADGS,
} from './parsers';

/** Class representing a press alert. */
export default class Alert {
  #collection;
  // #elastic;

  /**
  * Create a new alert.
  * @param {object} alert - The row json alert.
  */
  constructor(alert) {
    this.#collection = db.collection('press');
    // this.#elastic = elastic;
    this.data = Alert.parse(alert);
    this.detectedIds = [];
  }

  /**
  * Parse the raw alert using parser according to alert.sourceName.
  * @static
  * @param {object} alert - The row json alert.
  * @return {object} The parsed json alert
  */
  static parse(alert) {
    switch (alert.sourceName) {
      case 'aef':
        return parseAef(alert);
      case 'Newstank':
        return parseNewsTank(alert);
      case 'Etudes supérieures: tout savoir sur les formations du supérieur et réussir ses études - Le Figaro':
        return parseFigaro(alert);
      case 'Actualités Actualité avec Educpros - Educpros.fr':
        return parseEducPro(alert);
      case "Biographie des 500 personnalités de l'enseignement supérieur sur EducPros - Educpros.fr":
        return parseEducProPersonalites(alert);
      case 'Nominations - ADGS : Association des DGS d’établissements d’enseignement supérieur':
        return parseADGS(alert);
      default:
        throw Error('Unknown or missing `sourceName`');
    }
  }

  /**
  * Detect all paysage object mentioned in the alert.
  * @return {object} The Alert instance.
  */
  async detectPaysageObject() {
    // this.detectedIds = this.#elastic.search()
    return this;
  }

  /**
  * Save the object in mongo collection.
  * @return {object} The Alert instance.
  */
  async save() {
    await this.#collection.updateOne({ alertId: this.data.alertId }, { $set: { ...this.data, detectedIds: this.detectedIds } }, { upsert: true });
    return this;
  }

  /**
  * Get the alert object saved in database.
  * @return {object} The Alert instance.
  */
  async find() {
    return this.collection.findOne({ alertId: this.data.alertId });
  }
}
