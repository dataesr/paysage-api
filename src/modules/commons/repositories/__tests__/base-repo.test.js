import BaseRepo from '../base.repo';

const testRepository = new BaseRepo({ collection: 'test' });

const user = {
  id: Math.random().toString().substr(2, 8),
  username: 'tester',
  avatar: 'http://avatars.com/tester',
};

const data = [
  {
    name: 'test1',
    number: 8,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    name: 'test2',
    number: 16,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    name: 'test3',
    number: 24,
    createdBy: user.id,
    updatedBy: user.id,
  },
  {
    name: 'test4',
    number: 32,
    createdBy: user.id,
    updatedBy: user.id,
  },
];
let id;
beforeAll(async () => {
  await global.utils.db.collection('users').insertOne(user);
});
it('can insert data sucessfully', async () => {
  const insertedId = await testRepository.insert(data[0]);
  id = insertedId;
  expect(insertedId).toBeTruthy();
});
it('can insert many data sucessfully', async () => {
  await testRepository.insert(data[1]);
  await testRepository.insert(data[2]);
  await testRepository.insert(data[3]);
});
it('can find all documents', async () => {
  const result = await testRepository.find();
  expect(result.totalCount).toBe(4);
  expect(result.data).toHaveLength(4);
});
it('can find with filter sucessfully', async () => {
  const result = await testRepository.find({ name: 'test1' });
  expect(result.totalCount).toBe(1);
  expect(result.data).toHaveLength(1);
  expect(result.data[0].number).toBe(8);
});
it('can find with sort sucessfully', async () => {
  const result = await testRepository.find({}, { sort: '-name' });
  expect(result.totalCount).toBe(4);
  expect(result.data).toHaveLength(4);
  expect(result.data[0].number).toBe(32);
});
it('can find with limit sucessfully', async () => {
  const result = await testRepository.find({}, { limit: 3 });
  expect(result.totalCount).toBe(4);
  expect(result.data).toHaveLength(3);
});
it('can find with skip and limit sucessfully', async () => {
  const result = await testRepository.find({}, { limit: 3, skip: 2 });
  expect(result.totalCount).toBe(4);
  expect(result.data).toHaveLength(2);
});
it('can update one with id sucessfully', async () => {
  const result = await testRepository.updateById(id, { name: 'test11' });
  expect(result.ok).toBe(true);
});
it('can find one with id sucessfully', async () => {
  const result = await testRepository.findById(id);
  expect(result.id).toBeTruthy();
  expect(result.name).toBe('test11');
  expect(result.number).toBe(8);
});
it('can find one and project sucessfully', async () => {
  const result = await testRepository.findById(id, { returnFields: ['name', 'createdBy'] });
  expect(result.id).toBeFalsy();
  expect(result._id).toBeFalsy();
  expect(result.name).toBe('test11');
  expect(result.createdBy.username).toBe('tester');
  expect(result.createdBy.avatar).toBe('http://avatars.com/tester');
});
it('can delete one with id sucessfully', async () => {
  const { ok } = await testRepository.deleteById(id);
  expect(ok).toBe(true);
});
