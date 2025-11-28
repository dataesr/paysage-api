import readQuery from "../../api/commons/queries/relations.query";
import { client, db } from "../../services/mongo.service";
import {
	addInterim,
	formatDateToString,
	getCivility,
	getCivilityAddress,
	getRelationTypeLabel,
	isFinished,
} from "./utils";

const dataset = "fr-esr-paysage-fonctions-gouvernance";

export default async function exportFrEsrPaysageFonctionsGourvernance() {
	const data = await db
		.collection("relationships")
		.aggregate([{ $match: { relationTag: "gouvernance" } }, ...readQuery])
		.toArray();

	const json = data.map(
		({
			resource: structure = {},
			relatedObject: person = {},
			relationType = {},
			...relation
		}) => {
			const startDate = new Date(relation.startDate);
			const endDate = new Date(relation.endDate);
			const previsionalEndDate = new Date(relation.endDatePrevisional);
			let state;
			if (!relation.startDate && !relation.endDate) {
				state = "Actif";
			}
			if (relation.startDate && startDate > new Date()) {
				state = "Futur";
			}
			if (relation.startDate && startDate <= new Date()) {
				state = "Actif";
			}
			if (relation.endDate && endDate < new Date()) {
				state = "Passé";
			}
			if (relation.active === false) {
				state = "Passé";
			}
			const annelis =
				structure?.identifiers?.find((i) => i.type === "annelis")?.value &&
				relationType.annelisId
					? "Y"
					: "N";
			const row = {
				dataset,
				etat: state,
				liaison_id_paysage: relation.id,
				eta_cat: structure.category?.usualNameFr,
				eta_cat_jur: structure.legalcategory?.longNameFr,
				eta_cat_act: structure.categories
					.map((cat) => cat?.usualNameFr)
					.join(";"),
				eta_address: [
					structure.currentLocalisation?.distributionStatement,
					structure.currentLocalisation?.address,
					structure.currentLocalisation?.place,
				]
					.map((a) => a)
					.join("\n")
					.trim(),
				eta_cp: structure.currentLocalisation?.postalCode,
				eta_ville: structure.currentLocalisation?.locality,
				eta_id_paysage: structure.id,
				eta_lib: structure.currentName?.usualName,
				eta_scd_esgbu:
					structure.identifiers
						?.filter((i) => i.type === "sdid")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_wikidata:
					structure.identifiers
						?.filter((i) => i.type === "wikidata")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_idref:
					structure.identifiers
						?.filter((i) => i.type === "idref")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_uai:
					structure.identifiers
						?.filter((i) => i.type === "uai")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_siret:
					structure.identifiers
						?.filter((i) => i.type === "siret")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_grid:
					structure.identifiers
						?.filter((i) => i.type === "grid")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_ror:
					structure.identifiers
						?.filter((i) => i.type === "ror")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_annelis:
					structure.identifiers
						?.filter((i) => i.type === "annelis")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_esgbu:
					structure.identifiers
						?.filter((i) => i.type === "etid")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_bib_esgbu:
					structure.identifiers
						?.filter((i) => i.type === "bibid")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				eta_ed_id:
					structure.identifiers
						?.filter((i) => i.type === "ed")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				personne_id_paysage: person?.id,
				genre: person.gender?.[0],
				civilite: getCivility(person.gender),
				civilité_adresse_lettre: getCivilityAddress(
					relation,
					relationType,
					person,
				),
				titre: addInterim(
					relation.mandatePrecision ||
						relationType?.[getRelationTypeLabel(person.gender)],
					relation.mandateTemporary,
				),
				prenom: person.firstName,
				nom: person.lastName,
				idref:
					person.identifiers
						?.filter((i) => i.type === "idref")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				orcid:
					person.identifiers
						?.filter((i) => i.type === "orcid")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				wikidata:
					person.identifiers
						?.filter((i) => i.type === "wikidata")
						.sort((a, b) => a?.startDate?.localeCompare(b?.startDate))
						.map((i) => i.value)
						.join("|") || null,
				fonction_cat_id_paysage: relationType.id,
				fonction_cat_id: relationType.annelisId,
				interim: relation.mandateTemporary === true ? "O" : "N",
				fonction_cat_lib:
					person.gender === "Femme"
						? relationType.feminineName
						: relationType.maleName,
				fonction_cat_lib_U: relationType.name,
				fonction_cat_lib_exact:
					relation.mandatePrecision || person.gender === "Femme"
						? relationType.feminineName
						: relationType.maleName,
				fonction_groupe: relationType.mandateTypeGroup,
				email_generique: relation.mandateEmail,
				email_nominatif: relation.personalEmail,
				telephone: relation.mandatePhonenumber,
				position:
					relation.mandatePosition !== "ND" ? relation.mandatePosition : null,
				raison: relation.mandateReason,
				date_debut: startDate.getTime()
					? formatDateToString(startDate)
					: undefined,
				date_fin: endDate.getTime() ? formatDateToString(endDate) : undefined,
				date_fin_prevue: previsionalEndDate.getTime()
					? formatDateToString(previsionalEndDate)
					: undefined,
				date_maj: relation.updatedAt
					? formatDateToString(relation.updatedAt)
					: formatDateToString(relation.createdAt),
				date_fin_inconnue:
					isFinished(relation) && !relation.endDate ? "Oui" : null,
				texte_officiel_debut_id_paysage: relation.startDateOfficialText?.id,
				texte_officiel_debut_lib: relation.startDateOfficialText?.title,
				texte_officiel_debut_lien: relation.startDateOfficialText?.pageUrl,
				texte_officiel_fin_id_paysage: relation.endDateOfficialText?.id,
				texte_officiel_fin_lib: relation.endDateOfficialText?.title,
				texte_officiel_fin_lien: relation.endDateOfficialText?.pageUrl,
				annelis,
			};
			return row;
		},
	);
	const session = client.startSession();
	await session.withTransaction(async () => {
		await db.collection("opendata").deleteMany({ dataset });
		await db.collection("opendata").insertMany(json);
		await session.endSession();
	});

	return {
		status: "success",
		location: `/opendata/${dataset}`,
		length: json.length,
	};
}
