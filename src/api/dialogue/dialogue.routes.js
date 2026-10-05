import express from 'express';

import { db } from '../../services/mongo.service';
import getMandateState, { MANDATE_STATES } from '../commons/helpers/mandate-state';
import { BadRequestError } from '../commons/http-errors';
import emailDomainsQuery from './queries/email-domains.query';
import governanceQuery from './queries/governance.query';
import structuresQuery from './queries/structures.query';

// A read-only POST: readers may call it (see READ_ONLY_POSTS in rbac.middlewares).

const router = new express.Router();

const MAX_IDS = 5000;

const toIso = (value) => (value instanceof Date ? value.toISOString() : value ?? null);
const exactly = (id) => new RegExp(`^${id}$`, 'i');
const isPaysageLike = (id) => /^[a-zA-Z0-9]+$/.test(id);

async function resolveIds(requested) {
  const structures = db.collection('structures');
  const alive = { isDeleted: { $ne: true } };
  const exact = await structures.find({ ...alive, id: { $in: requested } }).project({ _id: 0, id: 1 }).toArray();
  const found = new Set(exact.map(({ id }) => id));
  const redirections = [];

  let missing = requested.filter((id) => !found.has(id) && isPaysageLike(id));
  if (missing.length) {
    const cased = await structures.find({ ...alive, id: { $in: missing.map(exactly) } }).project({ _id: 0, id: 1 }).toArray();
    missing = missing.filter((id) => {
      const match = cased.find((structure) => structure.id.toLowerCase() === id.toLowerCase());
      if (match) redirections.push({ id, replacedBy: match.id, reason: 'case' });
      return !match;
    });
  }
  if (missing.length) {
    const merged = await structures
      .find({ ...alive, alternativePaysageIds: { $in: missing.map(exactly) } })
      .project({ _id: 0, id: 1, alternativePaysageIds: 1 })
      .toArray();
    missing = missing.filter((id) => {
      const match = merged.find((structure) => structure.alternativePaysageIds
        .some((alternative) => alternative.toLowerCase() === id.toLowerCase()));
      if (match) redirections.push({ id, replacedBy: match.id, reason: 'merged' });
      return !match;
    });
  }
  const notFound = requested.filter((id) => !found.has(id) && !redirections.some((r) => r.id === id));
  const ids = [...new Set([...found, ...redirections.map((r) => r.replacedBy)])];
  return { ids, redirections, notFound };
}

const groupByStructure = (rows) => {
  const groups = new Map();
  rows.forEach(({ structureId, ...row }) => {
    if (!groups.has(structureId)) groups.set(structureId, []);
    groups.get(structureId).push(row);
  });
  return groups;
};

async function readGovernance(ids) {
  const mandates = await db.collection('relationships')
    .aggregate([{ $match: { resourceId: { $in: ids } } }, ...governanceQuery])
    .toArray();
  return groupByStructure(mandates
    .map(({ active, ...mandate }) => ({ mandate, state: getMandateState({ ...mandate, active }) }))
    .filter(({ state }) => state !== MANDATE_STATES.past)
    .map(({ mandate, state }) => ({
      ...mandate,
      state: state === MANDATE_STATES.future ? 'future' : 'active',
      updatedAt: toIso(mandate.updatedAt),
    })));
}

async function readEmailDomains(ids) {
  const domains = await db.collection('domains')
    .aggregate([
      { $match: { 'structures.structureId': { $in: ids } } },
      ...emailDomainsQuery,
      { $match: { structureId: { $in: ids } } },
    ])
    .toArray();
  return groupByStructure(domains);
}

router.post('/dialogue/structures', async (req, res) => {
  const requested = [...new Set((req.body.ids || []).map((id) => id.trim()).filter(Boolean))];
  if (!requested.length) throw new BadRequestError('"ids" must list at least one structure id');
  if (requested.length > MAX_IDS) throw new BadRequestError(`At most ${MAX_IDS} ids per call`);

  // The moment the read starts: the date of the snapshot.
  const generatedAt = new Date().toISOString();
  const { ids, redirections, notFound } = await resolveIds(requested);
  const [structures, governance, emailDomains] = await Promise.all([
    db.collection('structures').aggregate([{ $match: { id: { $in: ids } } }, ...structuresQuery]).toArray(),
    readGovernance(ids),
    readEmailDomains(ids),
  ]);

  res.status(200).json({
    generatedAt,
    redirections,
    notFound,
    structures: structures.map((structure) => ({
      ...structure,
      updatedAt: toIso(structure.updatedAt),
      emailDomains: emailDomains.get(structure.id) || [],
      governance: governance.get(structure.id) || [],
    })),
  });
});

export default router;
