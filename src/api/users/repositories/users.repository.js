import db from '../../../services/mongo.service';

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
  { $set: { createdBy: '$createdBy.username' } },
  {
    $lookup: {
      from: 'users',
      localField: 'updatedBy',
      foreignField: 'id',
      as: 'updatedBy',
    },
  },
  { $set: { updatedBy: { $arrayElemAt: ['$updatedBy', 0] } } },
  { $set: { updatedBy: '$updatedBy.username' } },
  { $project: { _id: 0, password: 0 } },
];

const defaultFields = [
  'firstName',
  'lastName',
  'username',
  'email',
  'id',
  'role',
  'active',
  'confirmed',
  'avatar',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
];

async function find({
  filters = {},
  skip = 0,
  limit = 20,
  sort = null,
  returnFields = defaultFields,
}) {
  const pipeline = [
    { $match: filters },
    { $skip: skip },
    { $limit: limit },
    ...userPipeline,
  ];

  if (!(returnFields[0] === '*')) {
    pipeline.push({ $project: returnFields.reduce(
      (doc, field) => ({ ...doc, [field]: 1 }), {},
    ) });
  }
  if (sort) {
    pipeline.push({ $sort: sort });
  }
  const res = await db.collection('users').aggregate(pipeline).toArray();
  return res.length ? res : null;
}

async function findById(id, returnFields = defaultFields) {
  const users = await find({ filters: { id }, limit: 1, returnFields });
  return users ? users[0] : null;
}

async function findByAccount(account, returnFields = defaultFields) {
  const users = await find({ filters: { $or: [{ email: account }, { username: account }] }, limit: 1, returnFields });
  return users ? users[0] : null;
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
  const { deletedCount } = await db.collection('users').deleteOne({ id });
  return (deletedCount === 1) ? id : null;
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
