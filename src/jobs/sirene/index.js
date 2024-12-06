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
	const lastSuccessfullExecution = db.collection("_jobs").find({
		name: SIREN_TASK_NAME,
		"result.status": "success",
	});
	const lastSuccessfullExecutionDate = lastSuccessfullExecution
		? lastSuccessfullExecution.result?.lastExecution
				?.toISOString()
				?.split("T")?.[0]
		: now.toISOString().split("T")?.[0];

	const siretStockFromPaysage = await getSiretStockFromPaysage();

	await new Promise((resolve) => setTimeout(resolve, 10000));

	const updatesInSirene = await fetchSireneUpdates(
		lastSuccessfullExecutionDate,
		new Date().toISOString().split("T")?.[0],
	);

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

	const ok = await db.collection("_siren").insertMany(stockUpdates);
	return { status: ok ? "success" : "failed", lastExecution: now };
}
