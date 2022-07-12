class BaseMongoTokens {
  constructor({ db, collection }) {
    this._db = db;
    this._collection = db(collection);
  }

  set = async ({ userId, userAgent, refreshToken, expireAt }) => {
    await this._collection.updateOne(
      { userId, userAgent },
      { $set: { userId, userAgent, refreshToken, expireAt } },
      { upsert: true },
    );
    return this._collection.findOne({ userId, userAgent });
  };

  remove = async (filters) => this._collection.deleteMany(filters);

  find = async (filters) => this._collection.find(filters).toArray();
}

export default BaseMongoTokens;
