import { authenticator, totp } from 'otplib';

const signin = async (email, userAgent) => {
  const { body } = await global.superapp
    .post('/signin')
    .set('User-Agent', userAgent)
    .send({ email, password: 'Passw0rd!' })
    .expect(200);
  return body;
};

const refresh = (refreshToken, userAgent) => global.superapp
  .post('/token')
  .set('User-Agent', userAgent)
  .send({ refreshToken });

beforeAll(async () => {
  await global.utils.createUser('auth');
});

describe('API > auth > tokens', () => {
  it('can use its access token', async () => {
    const { accessToken } = await signin('auth@test.com', 'jest');
    await global.superapp
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('cannot use its refresh token as an access token', async () => {
    const { refreshToken } = await signin('auth@test.com', 'jest');
    await global.superapp
      .get('/me')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(401);
  });

  it('can refresh its tokens', async () => {
    const { refreshToken } = await signin('auth@test.com', 'jest');
    const { body } = await refresh(refreshToken, 'jest').expect(200);
    await global.superapp
      .get('/me')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
  });

  it('cannot refresh with its access token', async () => {
    const { accessToken } = await signin('auth@test.com', 'jest');
    await refresh(accessToken, 'jest').expect(401);
  });

  it('cannot refresh after signout', async () => {
    const { accessToken, refreshToken } = await signin('auth@test.com', 'jest');
    await global.superapp
      .post('/signout')
      .set('User-Agent', 'jest')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
    await refresh(refreshToken, 'jest').expect(401);
  });

  it('cannot refresh once its account is deleted', async () => {
    await global.utils.createUser('deleted');
    const { refreshToken } = await signin('deleted@test.com', 'jest');
    await global.db.collection('users').deleteOne({ email: 'deleted@test.com' });
    await refresh(refreshToken, 'jest').expect(401);
  });
});

describe('API > auth > passwords', () => {
  it('signs out its other sessions when changing its password', async () => {
    await global.utils.createUser('change');
    const current = await signin('change@test.com', 'current');
    const other = await signin('change@test.com', 'other');
    await global.superapp
      .put('/me/password')
      .set('User-Agent', 'current')
      .set('Authorization', `Bearer ${current.accessToken}`)
      .send({ currentPassword: 'Passw0rd!', newPassword: 'N3wPassw0rd!' })
      .expect(200);
    await refresh(other.refreshToken, 'other').expect(401);
    await refresh(current.refreshToken, 'current').expect(200);
  });

  it('signs out all its sessions when resetting its password', async () => {
    await global.utils.createUser('reset');
    const otpSecret = authenticator.generateSecret();
    await global.db.collection('users').updateOne({ email: 'reset@test.com' }, { $set: { otpSecret } });
    const { refreshToken } = await signin('reset@test.com', 'jest');
    await global.superapp
      .post('/recovery/password')
      .set('X-Paysage-OTP', totp.generate(otpSecret))
      .send({ email: 'reset@test.com', password: 'N3wPassw0rd!' })
      .expect(200);
    await refresh(refreshToken, 'jest').expect(401);
  });
});
