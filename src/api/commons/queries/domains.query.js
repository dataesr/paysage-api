import metas from "./metas.query";
import structuresUltraLightQuery from "./structures.ultralight.query";

export default [
	...metas,
	{
		$lookup: {
			from: "structures",
			let: { structureIds: "$structures.structureId" },
			pipeline: [
				{ $match: { $expr: { $in: ["$id", "$$structureIds"] } } },
				...structuresUltraLightQuery,
			],
			as: "structuresData",
		},
	},
	{
		$addFields: {
			structures: {
				$map: {
					input: "$structures",
					as: "structureRef",
					in: {
						id: "$$structureRef.id",
						type: "$$structureRef.type",
						structureId: "$$structureRef.structureId",
						structure: {
							$arrayElemAt: [
								{
									$filter: {
										input: "$structuresData",
										cond: { $eq: ["$$this.id", "$$structureRef.structureId"] },
									},
								},
								0,
							],
						},
					},
				},
			},
		},
	},
	{
		$project: {
			_id: 0,
			id: 1,
			domainName: 1,
			archived: 1,
			structures: 1,
			createdBy: 1,
			createdAt: 1,
			updatedBy: 1,
			updatedAt: 1,
			// structuresData: 0,
		},
	},
];
