import BaseMongoRepository from '../repositories/base.mongo.repository';
import NestedMongoRepository from '../repositories/nested.mongo.repository';

const fakeUser = 'tester';
const userId = 42;

const useQuery = [
  { $set: {
    createdBy: {
      id: userId,
      username: fakeUser,
    },
  } },
  { $project: {
    _id: 0,
    id: 1,
    name: 1,
    createdBy: 1,
  } },
];
const data = [
  {
    id: 1,
    name: 'test1',
    number: 88,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 2,
    name: 'test2',
    number: 1616,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 3,
    name: 'test3',
    number: 2424,
    createdBy: userId,
    updatedBy: userId,
  },
  {
    id: 4,
    name: 'test4',
    number: 3232,
    createdBy: userId,
    updatedBy: userId,
  },
];

let resourceId;
let baseMongoRepository;
let nestedMongoRepository;

beforeAll(async () => {
  baseMongoRepository = new BaseMongoRepository({ db: global.utils.db, collection: 'test' });
  nestedMongoRepository = new NestedMongoRepository({ db: global.utils.db, collection: 'test', field: 'test' });
  resourceId = await baseMongoRepository.create(data[0]);
});

afterEach(async () => {
  await nestedMongoRepository.remove(resourceId, data[0].id);
  await nestedMongoRepository.remove(resourceId, data[1].id);
  await nestedMongoRepository.remove(resourceId, data[2].id);
  await nestedMongoRepository.remove(resourceId, data[3].id);
});

describe('create method', () => {
  it('should create data', async () => {
    const insertedId1 = await nestedMongoRepository.create(resourceId, data[0]);
    expect(insertedId1).toBe(data[0].id);
  });
});

describe('find method', () => {
  beforeEach(async () => {
    await nestedMongoRepository.create(resourceId, data[0]);
    await nestedMongoRepository.create(resourceId, data[1]);
    await nestedMongoRepository.create(resourceId, data[2]);
    await nestedMongoRepository.create(resourceId, data[3]);
  });

  it('should find all documents', async () => {
    const result = await nestedMongoRepository.find({ resourceId });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
  });

  it('should find with filter', async () => {
    const result = await nestedMongoRepository.find({ resourceId, filters: { name: 'test1' } });
    expect(result.totalCount).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].number).toBe(88);
  });

  it('should find with sort', async () => {
    const result = await nestedMongoRepository.find({ resourceId, sort: '-name' });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
    expect(result.data[0].number).toBe(3232);
  });

  it('should find with limit', async () => {
    const result = await nestedMongoRepository.find({ resourceId, limit: 3 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(3);
  });

  it('should find with skip and limit', async () => {
    const result = await nestedMongoRepository.find({ resourceId, limit: 3, skip: 2 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(2);
  });
});

describe('patch method', () => {
  beforeEach(async () => {
    await nestedMongoRepository.create(resourceId, data[0]);
  });

  it('should patch name by id', async () => {
    const { id } = data[0];
    const result = await nestedMongoRepository.patch(resourceId, id, { name: 'test42' });
    expect(result.ok).toBeTruthy();
  });
});

describe('get method', () => {
  beforeEach(async () => {
    await nestedMongoRepository.create(resourceId, data[0]);
  });

  it('should get by id', async () => {
    const { id } = data[0];
    const result = await nestedMongoRepository.get(resourceId, id);
    expect(result.id).toBe(id);
    expect(result.name).toBe('test1');
  });
  it('should get by id and use useQuery properly', async () => {
    const { id } = data[0];
    const result = await nestedMongoRepository.get(resourceId, id, { useQuery });
    expect(result.id).toBe(id);
    expect(result.name).toBe('test1');
    expect(result.number).toBeFalsy();
    expect(result.createdBy.id).toBe(userId);
    expect(result.createdBy.username).toBe(fakeUser);
  });
});

describe('remove method', () => {
  beforeEach(async () => {
    await nestedMongoRepository.create(resourceId, data[0]);
  });

  it('should remove by id', async () => {
    const { id } = data[0];
    const { ok } = await nestedMongoRepository.remove(resourceId, id);
    expect(ok).toBeTruthy();
    const find = await nestedMongoRepository.find({ resourceId, filters: { id } });
    expect(find.data.length).toBe(0);
  });
});
