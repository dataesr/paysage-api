import { db } from "../../services/mongo.service";
import { SIREN_TASK_NAME } from "./config";
import {
	fetchSirenDataById,
	fetchSireneUpdates,
	fetchSiretDataById,
} from "./fetcher";
import { getSiretStockFromPaysage } from "./get-stock";

async function getLastExecutionDate() {
	const filters = {
		name: SIREN_TASK_NAME,
		"result.status": "success",
		// repeatInterval: { $exists: true },
	};
	return db
		.collection("_jobs")
		.find(filters, { sort: { "result.lastExecution": -1 } })
		.toArray()?.[0]
		?.result?.lastExecution?.toISOString()
		?.slice(0, 19);
}

export default async function monitorSiren(job) {
	const now = new Date();
	const from = await getLastExecutionDate();
	const until = now.toISOString().slice(0, 19);
	if (!from) return { status: "failed", message: "No previous execution" };

	const siretStockFromPaysage = await getSiretStockFromPaysage();

	const updatesInSirene = await fetchSireneUpdates(from, until);

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
	if (stockUpdates.length === 0)
		return {
			status: "success",
			message: "Nothing to update",
			from,
			until,
			stockUpdates,
		};
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
