import {
	domainsRepository,
	domainsStructuresRepository,
	structuresRepository,
} from "../commons/repositories";
import catalog from "../commons/catalog";

export async function validateDomainName(req, res, next) {
	const { domainName: inputDomain } = req.body;

	const domainName = inputDomain.trim();

	if (
		!domainName ||
		typeof domainName !== "string" ||
		!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainName)
	) {
		return res.status(400).json({
			error:
				"Invalid domain name format. Must be a valid domain name (e.g., example.com)",
		});
	}
	req.body.domainName = domainName;

	next();
}
export async function ensureDomainNameIsUnique(req, res, next) {
	const { domainName } = req.body;

	const exists = await domainsRepository.findOne({ domainName });

	if (exists) {
		return res.status(400).json({
			error: "Domain name already exists",
		});
	}

	next();
}

export async function ensureAddStructureIsPossible(req, res, next) {
  const { domainId } = req.params;
	const { structureId } = req.body;
	const exists = await structuresRepository.findOne({id: structureId });
	const alreadyThere = await domainsStructuresRepository.get(domainId, { structureId });

	if (!exists) {
		return res.status(404).json({
			error: `Structure ${structureId} not found`,
		});
	}
	if (alreadyThere) {
		return res.status(400).json({
			error: `Structure ${structureId} already exists for the domain`,
		});
	}
	next();
}

export async function createWithStructuresMetas(req, res, next) {
	const { structures: inputStructures = [], ...rest } = req.body;
	const errors = [];

	const structureIds = inputStructures.map((el) => el.structureId);
	const { data: structuresData } = await structuresRepository.find({
		filters: { id: { $in: structureIds } },
	});
	const savedStructures = structuresData.map((structure) => structure.id);
	console.log("afterSaved", savedStructures)
	const notFoundStructures = structureIds.filter(
		(id) => !savedStructures.includes(id),
	);


	if (notFoundStructures.length > 0) {
		notFoundStructures.forEach((structureId) => {
			const index = structureIds.indexOf(structureId);
			errors.push({
				path: `structures[${index}].id`,
				message: `Structure '${structureId}' does not exist`,
			});
		});
	}


	if (errors.length > 0) {
		return res.status(400).json({ error: "Structure not found", errors });
	}

	const structures = [];
	const userId = req.currentUser?.id;
	const now = new Date();
	for (const struct of inputStructures) {
		let id = await catalog.getUniqueId("domain-structure", 15);
		structures.push({
			id,
			...struct,
			createdBy: userId,
			createdAt: now,
			updatedBy: userId,
			updatedAt: now,
		});
	}
	req.body = {
		...rest,
		structures,
	};
	next();
}
