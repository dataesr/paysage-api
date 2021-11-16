import db from '../../database';

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = '';
  for (let i = 0; i < 6; i += 1) {
    id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  for (let i = 0; i < 2; i += 1) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default async function getUniqueId() {
  let id;
  for (let retries = 0; retries < 100; retries += 1) {
    id = generateId();
    // eslint-disable-next-line no-await-in-loop
    const exists = await db.collection('catalogue').findOne({ id });
    if (!exists) { break; }
  }

  const { result } = await db.collection('catalogue')
    .insertOne({ id })
    .catch((e) => { throw new Error(e); });
  if (result.ok) { return id; }
  throw new Error('Too many retries ...');
}
