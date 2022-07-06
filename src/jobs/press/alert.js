import { db } from '../../services/mongo.service';
// import elastic from '../../services/elastic.service';

function parseAef(alert) {
  const { mapperValues } = alert;
  const { index } = mapperValues;
  const url = alert.link?.match(/https:\/\/www.aefinfo.fr\/depeche\/\d{1,10}/)?.[0];
  const id = url?.match(/\d{3,10}/)?.[0];
  const publicationDate = index.date
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${alert.sourceName}-${id}`,
    url,
    sourceName: alert.sourceName,
    title: index.titre,
    summary: index.intro,
    publicationDate,
    lastCrawlDate,
    number: index.numro,
    text: index.texte,
    author: index.auteur,
  };
}

class Alert {
  #collection;

  #elastic;

  constructor(alert) {
    if (!alert?.sourceName) throw Error('Parameter `alert` must have a `sourceName` attribute');
    this.#collection = db.collection('press');
    // this.#elastic = elastic;
    this.source = alert.sourceName;
    this.alert = this.parse(alert);
  }

  parse(alert, source) {
    switch (source) {
      case 'aef':
        return parseAef(this.alert);
      // case 'newsTank':
      //   return parseNewsTank(this.alert);
      default:
        throw Error('Parameter `alert` must have a `sourceName` attribute');
    }
  }

  async detectPaysageObject() {
    // const detectedIds = this.#elastic.search()
    // this.data = { ...this.data, detectedIds}
    return this;
  }

  async save() {
    return this.collection.updateOne({ id: this.data.id }, this.data, { upsert: true });
  }

  async find() {
    return this.collection.findOne({ id: this.data.id });
  }
}

export default class AefAlert extends Alert {
  constructor(alert) {
    super();
    this.data = AefAlert.parse(alert);
  }

  static parse(alert) {
    const { mapperValues } = alert;
    const { index } = mapperValues;
    const url = alert.link?.match(/https:\/\/www.aefinfo.fr\/depeche\/\d{1,10}/)?.[0];
    const id = url?.match(/\d{3,10}/)?.[0];
    const publicationDate = index.date
      ?.match(/\d{2}\/\d{2}\/\d{4}/)
      ?.[0]
      ?.replaceAll('/', '-');
    const lastCrawlDate = alert.crawlDate
      ?.match(/\d{2}\/\d{2}\/\d{4}/)
      ?.[0]
      ?.replaceAll('/', '-');
    return {
      id: `${alert.sourceName}-${id}`,
      url,
      sourceName: alert.sourceName,
      title: index.titre,
      summary: index.intro,
      publicationDate,
      lastCrawlDate,
      number: index.numro,
      text: index.texte,
      author: index.auteur,
    };
  }
}
