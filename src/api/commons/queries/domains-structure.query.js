import metas from "./metas.query";

export default [
	...metas,
	{
		$project: {
			_id: 0,
			id: 1,
			domainId: "$resourceId",
			structureId: 1,
			type: 1,
			createdBy: 1,
			createdAt: 1,
			updatedBy: 1,
			updatedAt: 1,
		},
	},
];
