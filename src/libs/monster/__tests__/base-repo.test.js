import MongoRepository from '../repositories/base.repository'

const data = [
  {
    id: 1,
    name: 'test1',
    number: 8,
    createdBy: 42,
    updatedBy: 42
  },
  {
    id: 2,
    name: 'test2',
    number: 16,
    createdBy: 42,
    updatedBy: 42
  },
  {
    id: 3,
    name: 'test3',
    number: 24,
    createdBy: 42,
    updatedBy: 42
  },
  {
    id: 4,
    name: 'test4',
    number: 32,
    createdBy: 42,
    updatedBy: 42
  }
];

let baseRepository;

beforeAll(() => {
  baseRepository = new MongoRepository({ db: global.utils.db, collection: 'test' });
});

afterEach(async () => {
  await baseRepository._collection.deleteMany({});
})

describe('create method', () => {
  it('should create data', async () => {
    const insertedId = await baseRepository.create(data[0]);
    expect(insertedId).toBe(data[0].id);
  });

  it('should create multiple data', async () => {
    const insertedId1 = await baseRepository.create(data[1]);
    expect(insertedId1).toBe(data[1].id);
    const insertedId2 = await baseRepository.create(data[2]);
    expect(insertedId2).toBe(data[2].id);
    const insertedId3 = await baseRepository.create(data[3]);
    expect(insertedId3).toBe(data[3].id);
  });
});

describe('find method', () => {
  beforeEach(async () => {
    await baseRepository.create(data[0]);
    await baseRepository.create(data[1]);
    await baseRepository.create(data[2]);
    await baseRepository.create(data[3]);
  });

  it('should find all documents', async () => {
    const result = await baseRepository.find();
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
  });

  it('should find with filter', async () => {
    const result = await baseRepository.find({ filters: { name: 'test1' } });
    expect(result.totalCount).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].number).toBe(8);
  });

  it('should find with sort', async () => {
    const result = await baseRepository.find({ sort: '-name' });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(4);
    expect(result.data[0].number).toBe(32);
  });

  it('should find with limit', async () => {
    const result = await baseRepository.find({ limit: 3 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(3);
  });

  it('should find with skip and limit', async () => {
    const result = await baseRepository.find({ limit: 3, skip: 2 });
    expect(result.totalCount).toBe(4);
    expect(result.data).toHaveLength(2);
  });
});

describe('updateById method', () => {
  beforeEach(async () => {
    await baseRepository.create(data[0]);
  });

  it('should update one with id', async () => {
    const { ok } = await baseRepository.patch(data[0].id, { name: 'test11' });
    expect(ok).toBeTruthy();
  });
});

describe('exists method', () => {
  beforeEach(async () => {
    await baseRepository.create(data[0]);
  });

  it('should find existing data', async () => {
    const result = await baseRepository.exists(data[0].id);
    expect(result).toBeTruthy();
  });

  it('should not find unexisting data', async () => {
    const result = await baseRepository.exists(42);
    expect(result).toBeFalsy();
  });
});

describe('remove method', () => {
  beforeEach(async () => {
    await baseRepository.create(data[0]);
  });

  it('should delete existing data', async () => {
    const { ok } = await baseRepository.remove(data[0].id);
    expect(ok).toBeTruthy();
  });

  it('should not delete unexisting data', async () => {
    const { ok } = await baseRepository.remove(42);
    expect(ok).toBeFalsy();
  });
});
