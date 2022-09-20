import { structures as resource, relationsGroups as subresource, relationTypes, persons, relations as subsubresource } from '../../resources';

let authorization;
let id;
let resourceId;
let relatedObjectId;
let relationTypeId;
let subresourceId;

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const structure = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    })
    .expect(201);
  resourceId = structure.body.id;

  const relType = await global.superapp
    .post(`/${relationTypes}`)
    .set('Authorization', authorization)
    .send({
      name: 'Président',
      for: ['persons'],
      priority: 5,
    })
    .expect(201);
  relationTypeId = relType.body.id;

  const person = await global.superapp
    .post(`/${persons}`)
    .set('Authorization', authorization)
    .send({
      lastName: 'Dupond',
      firstName: 'Jean',
      gender: 'Femme',
    })
    .expect(201);
  relatedObjectId = person.body.id;

  const relationGroup = await global.superapp
    .post(`/${resource}/${resourceId}/${subresource}`)
    .set('Authorization', authorization)
    .send({
      name: 'Gouvernance',
      accepts: ['persons'],
      priority: 5,
    })
    .expect(201);
  subresourceId = relationGroup.body.id;
});

describe('API > structures > relations > create', () => {
  it('can create successfully', async () => {
    const payload = { relatedObjectId, relationTypeId, startDate: '2022-01-01' };
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.relatedObject.id).toBe(relatedObjectId);
    id = body.id;
  });
});

describe('API > structures > relation > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(200);
    expect(body.startDate).toBe('2017-01-01');
  });
  it('throws bad request with malformed id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/45frK`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > structures > relations > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${subresourceId}/${subsubresource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});
