import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../src/config';

const { jwtSecret } = config;

export default class Utils {
  constructor(db) {
    this.db = db;
  }

  async createUser(username = 'user', admin = false) {
    const password = await bcrypt.hash('Passw0rd!', 10);
    const user = {
      id: Math.random().toString().substring(2, 10),
      email: `${username}@test.com`,
      password,
      avatar: 'http://avatars.com/tester',
      firstName: 'user',
      lastName: 'user',
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
