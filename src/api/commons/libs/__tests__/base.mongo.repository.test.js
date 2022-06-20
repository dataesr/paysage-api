import BaseMongoRepository from '../base.mongo.repository';

const userId = 42;
const fakeUser = 'tester';

const useQuery = [
  {
    $set: {
      createdBy: {
        id: userId,
        username: fakeUser,
      },
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      createdBy: 1,
    },
  },
];
const data = [
  {
    id: 1,
    name: 'test1',
    number: 8,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 2,
    name: 'test2',
    number: 16,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 3,
    name: 'test3',
    number: 24,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 4,
    name: 'test4',
    number: 32,
    createdBy: userId,
    updatedBy: userId,
  },
];

let baseMongoRepository;

beforeAll(() => {
  baseMongoRepository = new BaseMongoRepository({ db: global.utils.db, collection: 'test' });
});

afterEach(async () => {
  await baseMongoRepository._collection.deleteMany({});
});

describe('create method', () => {
  it('should create data', async () => {
    const insertedId = await baseMongoRepository.create(data[0]);
    expect(insertedId).toBe(data[0].id);
  });

  it('should create multiple data', async () => {
    const insertedId1 = await baseMongoRepository.create(data[1]);
    expect(insertedId1).toBe(data[1].id);
    const insertedId2 = await baseMongoRepository.create(data[2]);
    expect(insertedId2).toBe(data[2].id);
    const insertedId3 = await baseMongoRepository.create(data[3]);
    expect(insertedId3).toBe(data[3].id);
  });
});

describe('find method', () => {
  beforeEach(async () => {
    await baseMongoRepository.create(data[0]);
    await baseMongoRepository.create(data[1]);
    await baseMongoRepository.create(data[2]);
    await baseMongoRepository.create(data[3]);
  });

  it('should find all documents', async () => {
    const result = await baseMongoRepository.find();
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
  });

  it('should return all documents with specific query', async () => {
    const result = await baseMongoRepository.find({ useQuery });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
    const firstResultElement = result.data[0];
    expect(firstResultElement.id).toBe(data[0].id);
    expect(firstResultElement.name).toBe('test1');
    expect(firstResultElement.number).toBeFalsy();
    expect(firstResultElement.createdBy.id).toBe(userId);
    expect(firstResultElement.createdBy.username).toBe(fakeUser);
  });

  it('should find with filter', async () => {
    const result = await baseMongoRepository.find({ filters: { name: 'test1' } });
    expect(result.totalCount).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].number).toBe(8);
  });

  it('should find with sort', async () => {
    const result = await baseMongoRepository.find({ sort: '-name' });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
    expect(result.data[0].number).toBe(32);
  });

  it('should find with limit', async () => {
    const result = await baseMongoRepository.find({ limit: 3 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(3);
  });

  it('should find with skip and limit', async () => {
    const result = await baseMongoRepository.find({ limit: 3, skip: 2 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(2);
  });
});

describe('updateById method', () => {
  beforeEach(async () => {
    await baseMongoRepository.create(data[0]);
  });

  it('should update one with id', async () => {
    const { ok } = await baseMongoRepository.patch(data[0].id, { name: 'test11' });
    expect(ok).toBeTruthy();
  });
});

describe('exists method', () => {
  beforeEach(async () => {
    await baseMongoRepository.create(data[0]);
  });

  it('should find existing data', async () => {
    const result = await baseMongoRepository.exists(data[0].id);
    expect(result).toBeTruthy();
  });

  it('should not find unexisting data', async () => {
    const result = await baseMongoRepository.exists(userId);
    expect(result).toBeFalsy();
  });
});

describe('remove method', () => {
  beforeEach(async () => {
    await baseMongoRepository.create(data[0]);
  });

  it('should delete existing data', async () => {
    const { ok } = await baseMongoRepository.remove(data[0].id);
    expect(ok).toBeTruthy();
  });

  it('should not delete unexisting data', async () => {
    const { ok } = await baseMongoRepository.remove(userId);
    expect(ok).toBeFalsy();
  });
});
