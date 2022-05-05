import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../src/config/app.config';

const { jwtSecret } = config;

export default class Utils {
  constructor(db) {
    this.db = db;
  }

  async clearDB() {
    const collections = await this.db.listCollections().toArray();
    const collectionsToDelete = collections.filter((collection) => collection.name !== 'system.views');
    return Promise.all(collectionsToDelete.map((collection) => this.db.collection(collection.name).drop()));
  }

  async createUser(username = 'user', admin = false) {
    const password = await bcrypt.hash('Passw0rd!', 10);
    const user = {
      id: Math.random().toString().substring(2, 10),
      email: `${username}@test.com`,
      username,
      password,
      avatar: 'http://avatars.com/tester',
      firstName: 'firstName',
      lastName: 'lastName',
      active: true,
      confirmed: true,
      role: (admin) ? 'admin' : 'user',
    };
    await this.db.collection('users').insertOne(user);
    const accessToken = jwt.sign(
      { user },
      jwtSecret,
      { expiresIn: '15m' },
    );
    return `Bearer ${accessToken}`;
  }
}
