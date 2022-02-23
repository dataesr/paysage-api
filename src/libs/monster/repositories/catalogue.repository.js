class Catalogue {
  constructor({ db, collection }, length) {
    this._db = db;
    this._collection = db.collection(collection);
    this._idLength = length;
  }

  static generateId = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i += 1) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (id.startsWith(0) || id.match(/^\d*$/)) return Catalogue.generateId(length);
    return id;
  };

  getUniqueId = async (objectCollection) => {
    let _id;
    for (let retries = 0; retries < 100; retries += 1) {
      _id = Catalogue.generateId(this._idLength);
      // eslint-disable-next-line no-await-in-loop
      const exists = await this._collection.findOne({ _id });
      if (!exists) { break; }
    }

    const { result } = await this._collection
      .insertOne({ _id, objectCollection })
      .catch((e) => { throw new Error(e); });
    if (result.ok) { return _id; }
    throw new Error('Too many retries ...');
  };

  setUniqueId = async (id, objectCollection) => {
    const { result } = await this._collection.insertOne({ _id: id, objectCollection });
    if (result.ok) { return id; }
    throw new Error(`Cannot insert ID ${id}`);
  };
}

export default Catalogue;
