import express from "express";
import { createContext, patchContext, setGeneratedInternalIdInContext } from "../commons/middlewares/context.middlewares";
import controllers from "../commons/middlewares/crud.middlewares";
import nestedControllers from "../commons/middlewares/crud-nested.middlewares";
import { saveInStore } from "../commons/middlewares/event.middlewares";
import { requireRoles } from "../commons/middlewares/rbac.middlewares";
import readQuery from "../commons/queries/domains.query";
import readDomainStructureQuery from "../commons/queries/domains-structure.query";
import {
	domainsRepository,
	domainsStructuresRepository,
} from "../commons/repositories";
import {
	domains as resource,
	domainsStructures as subresource,
} from "../resources";
import {
	validateDomainName,
	ensureDomainNameIsUnique,
	createWithStructuresMetas,
  ensureAddStructureIsPossible,
} from "./domains.middlewares";

const router = new express.Router();

router
	.route(`/${resource}`)
	.get(controllers.list(domainsRepository, readQuery))
	.post([
		requireRoles(["admin"]),
		createContext,
    setGeneratedInternalIdInContext(resource),
		validateDomainName,
		ensureDomainNameIsUnique,
		createWithStructuresMetas,
		controllers.create(domainsRepository, readQuery),
		saveInStore(resource),
	]);

router
	.route(`/${resource}/:id`)
	.get([
		requireRoles(["admin"]),
		controllers.read(domainsRepository, readQuery, true),
	])
	.patch([
		requireRoles(["admin"]),
		patchContext,
		controllers.patch(domainsRepository, readQuery, true),
		saveInStore(resource),
	])
	.delete([
		requireRoles(["admin"]),
		patchContext,
		controllers.remove(domainsRepository),
		saveInStore(resource),
	]);

router
	.route(`/${resource}/:resourceId/${subresource}`)
	.post([
		requireRoles(["admin"]),
		ensureAddStructureIsPossible,
		createContext,
		setGeneratedInternalIdInContext(`domain-${subresource}`),
		nestedControllers.create(domainsStructuresRepository, readDomainStructureQuery),
		saveInStore(`domain-${subresource}`),
	]);

router
	.route(`/${resource}/:resourceId/${subresource}/:id`)
	.delete([
		requireRoles(["admin"]),
		patchContext,
		nestedControllers.remove(domainsStructuresRepository),
		saveInStore(`domain-${subresource}`),
	]);

export default router;
