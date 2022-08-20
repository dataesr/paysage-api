import {
  structures as resource,
  emails as subresource,
  emailtypes,
} from '../../resources';

let authorization;
let id;
let resourceId;
let emailTypeId;

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body: emailTypeBody } = await global.superapp
    .post(`/${emailtypes}`)
    .set('Authorization', authorization)
    .send({
      usualName: 'Président',
      otherNames: ['Presidence'],
    });
  const { body } = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    });
  emailTypeId = emailTypeBody.id;
  resourceId = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/${resource}/${resourceId}/${subresource}`)
    .set('Authorization', authorization)
    .send({
      emailTypeId,
      email: 'secretariat@univ.fr',
    });
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > structures > emails > create', () => {
  it('should create a new email', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ emailTypeId, email: 'secretariat@univ.fr' })
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
    expect(body.emailType.id).toBe(emailTypeId);
    expect(body.email).toBe('secretariat@univ.fr');
    expect(body.createdBy.lastName).toBe('user');

    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if type is missing', async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ email: 'secretariat@univ.fr' })
      .expect(400);
  });

  it('should throw bad request if email is missing', async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ emailTypeId })
      .expect(400);
  });

  it('should throw bad request if email is malformed', async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ emailTypeId, email: 'not an email' })
      .expect(400);
  });
});

describe('API > structures > emails > update', () => {
  it('should update an existing email', async () => {
    const email = 'test@test.com';
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ email })
      .expect(200);
    expect(body.email).toBe(email);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45frK`)
      .set('Authorization', authorization)
      .send({ email: 'test@test.com' })
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ email: 'test@test.com' })
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ email: 'not an email' })
      .expect(400);
  });
});

describe('API > structures > emails > read', () => {
  it('should read existing email', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.emailType.id).toBe(emailTypeId);
    expect(body.emailType.usualName).toBe('Président');
    expect(body.email).toBe('secretariat@univ.fr');
    expect(body.createdBy.lastName).toBe('user');
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > emails > delete', () => {
  it('should throw bad request if id too short', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });

  it('should delete existing email', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > emails > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ emailTypeId, email: 'secretariat@univ.fr' });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ emailTypeId, email: 'secretariat1@univ.fr' });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ emailTypeId, email: 'secretariat2@univ.fr' });
  });

  beforeEach(async () => {
    if (id) {
      await global.superapp
        .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
        .set('Authorization', authorization);
    }
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('secretariat@univ.fr');
    expect(docs).toContain('secretariat1@univ.fr');
    expect(docs).toContain('secretariat2@univ.fr');
  });

  it('should skip emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('secretariat1@univ.fr');
    expect(docs).toContain('secretariat2@univ.fr');
    expect(body.totalCount).toBe(3);
  });

  it('should limit emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('secretariat@univ.fr');
    expect(body.totalCount).toBe(3);
  });

  it('should sort emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=email`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('secretariat1@univ.fr');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=-email`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('secretariat@univ.fr');
    expect(body.totalCount).toBe(3);
  });
});
