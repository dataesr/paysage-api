function generateId(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i += 1) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (id.startsWith(0) || id.match(/^\d*$/)) return generateId();
  return id;
}

class Catalogue {
  constructor({ db, collection }, length = 5) {
    this._db = db;
    this._collection = db.collection(collection);
    this._idLength = length;
  }

  static generateId = (length = 5) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i += 1) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (id.startsWith(0) || id.match(/^\d*$/)) return generateId();
    return id;
  };

  getUniqueId = async (objectCollection) => {
    let _id;
    for (let retries = 0; retries < 100; retries += 1) {
      _id = generateId(this._idLength);
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
}

export default Catalogue;
