import { db } from "../../services/mongo.service";
import { SIREN_TASK_NAME } from "./config";
import {
	fetchSirenDataById,
	fetchSireneUpdates,
	fetchSiretDataById,
} from "./fetcher";
import { getSiretStockFromPaysage } from "./get-stock";

export default async function monitorSiren(job) {
	const now = new Date();
	const lastSuccessfullExecution = db
		.collection("_jobs")
		.find(
			{
				name: SIREN_TASK_NAME,
				"result.status": "success",
			},
			{ sort: { lastFinishedAt: -1 } },
		)
		.toArray();
	const from = lastSuccessfullExecution
		? lastSuccessfullExecution.result?.lastExecution
				?.toISOString()
				?.slice(0, 19)
		: now.toISOString().slice(0, 19);

	const siretStockFromPaysage = await getSiretStockFromPaysage();

	const until = new Date().toISOString().slice(0, 19);
	const updatesInSirene = await fetchSireneUpdates(from, until);
	console.log(updatesInSirene?.length, updatesInSirene);

	const stockToBeUpdated = siretStockFromPaysage.filter(({ siret }) =>
		updatesInSirene.some((update) => update.siret === siret),
	);
	console.log(stockToBeUpdated?.length, stockToBeUpdated);
	const stockUpdates = [];
	for (const stockElement of stockToBeUpdated) {
		const siretData = await fetchSiretDataById(stockElement.siret);
		const sireneData = await fetchSirenDataById(stockElement.siren);
		stockUpdates.push({
			...stockElement,
			siretData,
			sireneData,
		});
	}
	if (stockUpdates.length === 0) {
		return {
			status: "success",
			lastExecution: now,
			from,
			until,
			updatesInSirene,
			stockUpdates: [],
		};
	}
	const ok = await db.collection("_siren").insertMany(stockUpdates);
	return {
		status: ok ? "success" : "failed",
		lastExecution: now,
		from,
		until,
		updatesInSirene,
		stockUpdates,
	};
}
