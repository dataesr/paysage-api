class BaseMongoCatalog {
  constructor({ db, collection }) {
    this._db = db;
    this._collection = db.collection(collection);
  }

  static generateId = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i += 1) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (id.startsWith(0) || id.match(/^\d*$/)) return BaseMongoCatalog.generateId(length);
    return id;
  };

  getUniqueId = async (collection, idLength) => {
    let _id;
    for (let retries = 0; retries < 100; retries += 1) {
      _id = BaseMongoCatalog.generateId(idLength);
      // eslint-disable-next-line no-await-in-loop
      const exists = await this._collection.findOne({ _id });
      if (!exists) { break; }
    }

    const { acknowledged } = await this._collection
      .insertOne({ _id, collection })
      .catch((e) => { throw new Error(e); });
    if (acknowledged) { return _id; }
    throw new Error('Too many retries ...');
  };

  setUniqueId = async (id, collection) => {
    const { acknowledged } = await this._collection.insertOne({ _id: id, collection });
    if (acknowledged) { return id; }
    throw new Error(`Cannot insert ID ${id}`);
  };
}

export default BaseMongoCatalog;
