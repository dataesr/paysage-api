import { db } from '../../services/mongo.service';
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

  /**
  * Create a new alert.
  * @param {object} alert - The row json alert.
  */
  constructor(alert) {
    this.#collection = db.collection('press');
    this.data = this.parse(alert);
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
  * Save the object in mongo collection.
  * @return {object} The Alert instance.
  */
  async save() {
    const exists = this.#collection.findOne({ alertId: this.data.alertId });
    if (exists) return { ok: 1, status: 'exists' };
    // search in elastic for potentially related elements.
    const response = await this.#collection.updateOne(
      { alertId: this.data.alertId },
      { $set: { ...this.data } },
      { upsert: true },
    );
    return { ok: 1, status: response };
  }
}
