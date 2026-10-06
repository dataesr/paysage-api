import { forbidReadersToWrite, requireAuth } from '../../commons/middlewares/rbac.middlewares';

// The route Dialogue calls every night: everything it keeps about its
// structures, in one call, one JSON document. Fixtures for mandates, categories
// and domains go straight to the database — this file tests what the route READS.

let authorization;
let lyon;
let rennes;
let named;

const ago = (days) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const ahead = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const createStructure = async (usualName) => {
  const { body } = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({ structureStatus: 'active', creationDate: '1973', usualName });
  return body.id;
};

// The expected governance, written by hand: which mandates Dialogue gets, and
// which it never sees.
const MANDATES = [
  { id: 'gov-current', startDate: ago(400), group: 'direction', expected: 'active' },
  { id: 'gov-announced', startDate: ahead(30), group: 'direction', expected: 'future' },
  { id: 'gov-ended', startDate: ago(2000), endDate: ago(400), group: 'direction', expected: null },
  { id: 'gov-inactive', startDate: ago(100), active: false, group: 'direction', expected: null },
  { id: 'gov-board', startDate: ago(100), group: 'board', expected: null },
];

// The successions, written by hand: one relation, held by the successor and
// pointing at its predecessor — and the two Dialogue never sees.
const SUCCESSIONS = [
  { id: 'succ-merger', successor: 'heir', predecessor: 'lyon', expected: true },
  { id: 'succ-deleted', successor: 'ghost', predecessor: 'lyon', expected: false },
  { id: 'succ-loop', successor: 'lyon', predecessor: 'lyon', expected: false },
];

beforeAll(async () => {
  authorization = await global.utils.createUser('dialogue');
  lyon = await createStructure('Université Lumière Lyon 2');
  rennes = await createStructure('Université de Rennes');
  named = {
    lyon,
    heir: await createStructure('Université Lumière Lyon'),
    ghost: await createStructure('Université fantôme'),
  };
  await global.db.collection('structures').updateOne({ id: named.ghost }, { $set: { isDeleted: true } });

  await global.superapp
    .post(`/structures/${lyon}/identifiers`)
    .set('Authorization', authorization)
    .send({ type: 'uai', value: '0691775E', active: true, startDate: '1973-01-01' });

  await global.db.collection('structures').updateOne({ id: rennes }, { $set: { alternativePaysageIds: ['OldR1'] } });
  await global.db.collection('categories').insertOne({ id: 'catUn', usualNameFr: 'Université', priority: 1 });
  await global.db.collection('relationships').insertOne({
    id: 'rel-category', resourceId: lyon, relatedObjectId: 'catUn', relationTag: 'structure-categorie',
  });
  await global.db.collection('relationtypes').insertMany([
    {
      id: 'rtPres', name: 'Président', maleName: 'Président', feminineName: 'Présidente', priority: 1, mandateTypeGroup: 'Équipe de direction',
    },
    { id: 'rtCa', name: 'Membre du CA', priority: 50, mandateTypeGroup: 'Conseil d\'administration' },
  ]);
  await global.db.collection('persons').insertOne({
    id: 'persMarie', firstName: 'Marie', lastName: 'Curie', gender: 'Femme',
  });
  await global.db.collection('relationships').insertMany(MANDATES.map((mandate) => ({
    id: mandate.id,
    resourceId: lyon,
    relatedObjectId: 'persMarie',
    relationTypeId: mandate.group === 'direction' ? 'rtPres' : 'rtCa',
    relationTag: 'gouvernance',
    startDate: mandate.startDate,
    ...(mandate.endDate && { endDate: mandate.endDate }),
    ...(mandate.active === false && { active: false }),
    mandateEmail: 'presidence@univ-lyon2.fr',
    personalEmail: ' marie.curie@univ-lyon2.fr ',
  })));
  await global.db.collection('relationships').insertMany(SUCCESSIONS.map((succession) => ({
    id: succession.id,
    resourceId: named[succession.successor],
    relatedObjectId: named[succession.predecessor],
    relationTag: 'structure-predecesseur',
    startDate: '2025-01-01',
  })));
  await global.db.collection('domains').insertMany([
    {
      id: 'dom-lyon', domainName: 'Univ-Lyon2.fr', archived: false, structures: [{ id: 'link1', structureId: lyon, type: 'primary' }],
    },
    {
      id: 'dom-old', domainName: 'old-lyon2.fr', archived: true, structures: [{ id: 'link2', structureId: lyon, type: 'historical' }],
    },
  ]);
});

const post = (ids) => global.superapp
  .post('/dialogue/structures')
  .set('Authorization', authorization)
  .send({ ids });
const read = async (ids) => (await post(ids).expect(200)).body;

describe('API > dialogue > structures', () => {
  it('answers what Dialogue keeps: identity, identifiers, categories, domains', async () => {
    const response = await post([lyon]).expect(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    const [structure] = response.body.structures;
    expect(structure.id).toBe(lyon);
    expect(structure.status).toBe('active');
    expect(structure.currentName.usualName).toBe('Université Lumière Lyon 2');
    expect(structure.identifiers.map((i) => [i.type, i.value])).toEqual([['uai', '0691775E']]);
    expect(structure.categories).toEqual([{ id: 'catUn', usualNameFr: 'Université', priority: 1 }]);
    // Lower-cased, and the archived domain is left out.
    expect(structure.emailDomains).toEqual([{ domain: 'univ-lyon2.fr', type: 'primary' }]);
  });

  it('governance: direction team mandates, current or announced — derived from the table', async () => {
    const { structures } = await read([lyon]);
    const expected = MANDATES.filter((m) => m.expected !== null).map((m) => [m.id, m.expected]);
    expect(structures[0].governance.map((m) => [m.id, m.state])).toEqual(expected);
    const [current] = structures[0].governance;
    expect(current.title).toBe('Présidente');
    expect(current.relationType).toEqual({ id: 'rtPres', name: 'Président', priority: 1 });
    expect(current.emails).toEqual([
      { address: 'presidence@univ-lyon2.fr', kind: 'generic' },
      { address: 'marie.curie@univ-lyon2.fr', kind: 'nominative' },
    ]);
  });

  it('counter-check: the ended mandate comes back once it has no end date', async () => {
    await global.db.collection('relationships').updateOne({ id: 'gov-ended' }, { $unset: { endDate: '' } });
    const { structures } = await read([lyon]);
    expect(structures[0].governance.map((m) => m.id)).toContain('gov-ended');
    await global.db.collection('relationships').updateOne({ id: 'gov-ended' }, { $set: { endDate: ago(400) } });
  });

  it('successions: both ends of the one relation — derived from the table', async () => {
    const { structures } = await read([lyon, named.heir]);
    const links = Object.fromEntries(structures.map((structure) => [structure.id, {
      predecessors: structure.predecessors.map((link) => link.id),
      successors: structure.successors.map((link) => link.id),
    }]));
    const expected = Object.fromEntries([lyon, named.heir].map((id) => [id, { predecessors: [], successors: [] }]));
    SUCCESSIONS.filter((succession) => succession.expected).forEach((succession) => {
      expected[named[succession.successor]]?.predecessors.push(named[succession.predecessor]);
      expected[named[succession.predecessor]]?.successors.push(named[succession.successor]);
    });
    expect(links).toEqual(expected);
    // The other end comes with what Dialogue needs to propose it.
    const [predecessor] = structures.find((structure) => structure.id === named.heir).predecessors;
    expect(predecessor).toEqual({
      id: lyon,
      usualName: 'Université Lumière Lyon 2',
      status: 'active',
      closureDate: null,
      date: '2025-01-01',
    });
  });

  it('counter-check: the deleted successor comes back once it is restored', async () => {
    await global.db.collection('structures').updateOne({ id: named.ghost }, { $unset: { isDeleted: '' } });
    const { structures } = await read([lyon]);
    expect(structures[0].successors.map((link) => link.id)).toContain(named.ghost);
    await global.db.collection('structures').updateOne({ id: named.ghost }, { $set: { isDeleted: true } });
  });

  it('every id is answered: found, redirected, or not found', async () => {
    const body = await read([lyon, lyon.toLowerCase(), 'oldr1', 'zzzzz']);
    const { generatedAt, structures, redirections, notFound } = body;
    expect(structures.map((s) => s.id).sort()).toEqual([lyon, rennes].sort());
    const answered = redirections.map((r) => [r.id, r.replacedBy, r.reason]);
    if (lyon.toLowerCase() !== lyon) expect(answered).toContainEqual([lyon.toLowerCase(), lyon, 'case']);
    expect(answered).toContainEqual(['oldr1', rennes, 'merged']);
    expect(notFound).toEqual(['zzzzz']);
    expect(Number.isNaN(Date.parse(generatedAt))).toBe(false);
  });

  it('refuses a call without ids, or with more than 5000', async () => {
    await global.superapp.post('/dialogue/structures').set('Authorization', authorization).send({}).expect(400);
    const many = Array.from({ length: 5001 }, (_, i) => `x${String(i).padStart(4, '0')}`);
    const { body } = await global.superapp
      .post('/dialogue/structures')
      .set('Authorization', authorization)
      .send({ ids: many })
      .expect(400);
    // The 400 must be about the count — not something else.
    expect(JSON.stringify(body)).toMatch(/5000/);
  });
});

describe('API > dialogue > a read-only POST, open to readers', () => {
  // The role checks are skipped in testing: run the middlewares as in production.
  const asProduction = (middleware, req) => {
    const environment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      let passed = false;
      middleware(req, {}, () => { passed = true; });
      return passed;
    } finally {
      process.env.NODE_ENV = environment;
    }
  };
  const request = (role, method, path) => ({ method, path, currentUser: { id: 'key', role } });

  it.each([
    ['reader', forbidReadersToWrite],
    ['viewer', requireAuth],
  ])('a %s may POST /dialogue/structures — and no other POST', (role, middleware) => {
    expect(asProduction(middleware, request(role, 'POST', '/dialogue/structures'))).toBe(true);
    // Counter-checks: another POST, and another method on the same path.
    expect(() => asProduction(middleware, request(role, 'POST', '/structures'))).toThrow('Insufficient user rights');
    expect(() => asProduction(middleware, request(role, 'PATCH', '/dialogue/structures'))).toThrow('Insufficient user rights');
  });
});
