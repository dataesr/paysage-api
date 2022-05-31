import mongo from '../src/services/mongo.service';

const { client, db } = mongo;

describe('config tests', () => {
  it('should successfully use mongo transactions', async () => {
    const session = client.startSession();
    await session.withTransaction(async () => {
      await db.collection('test').insertOne({ id: 1 });
      const test = await db.collection('test').findOne({ id: 1 });
      await session.endSession();
      expect(test.id).toBe(1);
    });
  });
});
