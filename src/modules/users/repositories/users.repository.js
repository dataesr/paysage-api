import db from '../../commons/services/database.service';

const userPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'createdBy',
      foreignField: 'id',
      as: 'createdBy',
    },
  },
  { $set: { createdBy: { $arrayElemAt: ['$createdBy', 0] } } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'updatedBy',
    },
  },
  { $set: { updatedBy: { $arrayElemAt: ['$updatedBy', 0] } } },
  { $project: { _id: 0, password: 0 } },
];

const defaultFields = [
  'firstName',
  'lastName',
  'username',
  'email',
  'id',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
];

async function find(filters = {}, limit = null, skip = null, sort = null, returnFields = defaultFields) {
  const pipeline = [
    { $match: filters },
    { $skip: skip },
    { $limit: limit },
    ...userPipeline,
  ];
  if (!returnFields[0] === '*') {
    pipeline.push({ $project: returnFields.reduce(
      (doc, field) => ({ ...doc, [field]: 1 }), {},
    ) });
  }
  if (sort) {
    pipeline.push({ $sort: sort });
  }
  const res = await db.collection('users').aggregate(pipeline).toArray();
  return res.length ? res[0] : null;
}

async function findById(id, returnFields = defaultFields) {
  return find({ id }, 1, 0, null, returnFields);
}

async function findByAccount(account, returnFields = defaultFields) {
  return find({ $or: [{ email: account }, { username: account }] }, 1, 0, null, returnFields);
}

async function findByAccountWithPassword(account) {
  const user = await db.collection('users').findOne(
    { $or: [{ email: account }, { username: account }] },
    { projection: { _id: 0 } },
  );
  return user;
}

async function insert(data, returnFields = defaultFields) {
  await db.collection('users').insertOne(data);
  return findById(data.id, returnFields);
}

async function updateById(id, data, returnFields = defaultFields) {
  await db.collection('users').updateOne({ id }, { $set: data });
  return findById(id, returnFields);
}

async function deleteById(id) {
  await db.collection('users').findOneAndDelete({ id });
  return null;
}

export default {
  find,
  findById,
  findByAccount,
  findByAccountWithPassword,
  insert,
  updateById,
  deleteById,
};
