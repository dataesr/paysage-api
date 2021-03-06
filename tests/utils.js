import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../src/config/app.config';

const {
  jwtSecret,
  accessTokenExpiresIn,
} = config;

export default class Utils {
  constructor(db) {
    this.db = db;
  }

  async clearDB() {
    const collections = await this.db.listCollections().toArray();
    await Promise.all(collections.map(async (collection) => {
      await this.db.collection(collection.name).deleteMany({});
    }));
  }

  async createUser(username = 'user', admin = false) {
    const password = await bcrypt.hash('Passw0rd!', 10);
    const user = {
      id: Math.random().toString().substr(2, 8),
      email: `${username}@test.com`,
      username,
      password,
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
      { expiresIn: accessTokenExpiresIn },
    );
    return `Bearer ${accessToken}`;
  }
}
