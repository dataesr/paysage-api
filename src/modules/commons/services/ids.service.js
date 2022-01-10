import db from './database.service';

function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i += 1) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (id.startsWith(0) || id.match(/\d{5}$/)) return generateId();
  return id;
}

export async function getUniqueId() {
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
