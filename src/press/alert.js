// import { db } from '../services/mongo.service';

// const pressCollection = db.press;

export default class Alert {
  constructor(row) {
    console.log(row);
    
    this.data = Alert.parse(row);
  }
  static parse({
    alertId,
    titre: title,
    intro: summary,
    mapperValues,
    sourceName,
    crawlDate: lastCrawlDate,
    link: url
  }) {
    const details = mapperValues.index;
    const data = {};
    data.id = alertId;
    data.sourceName = sourceName;
    data.title = details?.titre || titre;
    data.summary = details?.intro;
    data.publicationDate = details?.date;
    data.lastCrawlDate = lastCrawlDate;
    data.url = url;
    data.number = details?.numro;
    data.text = details?.texte;
    data.author = details?.auteur;

    return data;
  }
}