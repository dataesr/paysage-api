import BaseMongoRepository from '../repositories/base.repository'
import NestedMongoRepository from '../repositories/nested.repository'

const metasPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      createdBy:
      {
        id: { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'user',
    },
  },
  { $set: { user: { $arrayElemAt: ['$user', 0] } } },
  {
    $set: {
      updatedBy:
      {
        id: { $ifNull: ['$user.id', null] },
        username: { $ifNull: ['$user.username', null] },
        avatar: { $ifNull: ['$user.avatar', null] },
      },
    },
  },
  { $project: { user: 0 } },
];

const user = {
  id: Math.random().toString().substring(2, 10),
  username: 'tester',
  avatar: 'http://avatars.com/tester',
};

const data = [
  {
    id: 1,
    name: 'test1',
    number: 88,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    id: 2,
    name: 'test2',
    number: 1616,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    id: 3,
    name: 'test3',
    number: 2424,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    id: 4,
    name: 'test4',
    number: 3232,
    createdBy: user.id,
    updatedBy: user.id,
  },
];

let rid;
let baseMongoRepository;
let nestedRepository;

beforeAll(async () => {
  baseMongoRepository = new BaseMongoRepository({ db: global.utils.db, collection: 'test' });
  nestedRepository = new NestedMongoRepository({ db: global.utils.db, collection: 'test', field: 'test', pipeline: metasPipeline });
  await global.utils.db.collection('users').insertOne(user);
  const insertedId = await baseMongoRepository.create({ id: 1, name: 'test1', createdBy: user.id, updatedBy: user.id });
  rid = insertedId;
});

afterEach(async () => {
  await nestedRepository.remove(rid, data[0].id);
  await nestedRepository.remove(rid, data[1].id);
  await nestedRepository.remove(rid, data[2].id);
  await nestedRepository.remove(rid, data[3].id);
});

describe('create method', () => {
  it('should create data', async () => {
    const insertedId1 = await nestedRepository.create(rid, data[0]);
    expect(insertedId1).toBe(data[0].id);
  });
});


describe('find method', () => {
  beforeEach(async () => {
    await nestedRepository.create(rid, data[0]);
    await nestedRepository.create(rid, data[1]);
    await nestedRepository.create(rid, data[2]);
    await nestedRepository.create(rid, data[3]);
  });

  it('should find all documents', async () => {
    const result = await nestedRepository.find({ rid });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
  });

  it('should find with filter', async () => {
    const result = await nestedRepository.find({ rid, filters: { name: 'test1' } });
    expect(result.totalCount).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].number).toBe(88);
  });

  it('should find with sort', async () => {
    const result = await nestedRepository.find({ rid, sort: '-name' });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
    expect(result.data[0].number).toBe(3232);
  });

  it('should find with limit', async () => {
    const result = await nestedRepository.find({ rid, limit: 3 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(3);
  });
  
  it('should find with skip and limit', async () => {
    const result = await nestedRepository.find({ rid, limit: 3, skip: 2 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(2);
  });
});

describe('patch method', () => {
  beforeEach(async () => {
    await nestedRepository.create(rid, data[0]);
  });

  it('should patch name by id', async () => {
    const id = data[0].id;
    const result = await nestedRepository.patch(rid, id, { name: 'test42' });
    expect(result.ok).toBeTruthy();
  });  
})

describe('get method', () => {
  beforeEach(async () => {
    await nestedRepository.create(rid, data[0]);
  });

  it('should get by id', async () => {
    const id = data[0].id;
    const result = await nestedRepository.get(rid, id);
    expect(result.id).toBe(id);
    expect(result.name).toBe('test1');
  });
})

describe('remove method', () => {
  beforeEach(async () => {
    await nestedRepository.create(rid, data[0]);
  });

  it('should remove by id', async () => {
    const id = data[0].id;
    const { ok } = await nestedRepository.remove(rid, id);
    expect(ok).toBeTruthy();
    const find = await nestedRepository.find({ rid, filters: { id } });
    expect(find.data.length).toBe(0);
  });
})