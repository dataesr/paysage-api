import structuresLightQuery from "./structures.light.query";

export default [
	{
		$lookup: {
			from: "structures",
			localField: "paysage",
			foreignField: "id",
			pipeline: structuresLightQuery,
			as: "paysageData",
		},
	},
];
