import config from "../../config";

const { apiUrl, apiKey } = config.sirene;

const headers = { "X-INSEE-Api-Key-Integration": apiKey };

export const fetchSireneUpdates = async (startDate, endDate) => {
	const buildParams = (cursor) =>
		new URLSearchParams({
			q: `dateDernierTraitementEtablissement:[${startDate} TO ${endDate}]`,
			champs: "siret,dateDernierTraitementEtablissement",
			nombre: "1000",
			curseur: cursor,
		});

	const fetchPage = async (cursor = "*") => {
		const url = `${apiUrl}/siret?${buildParams(cursor).toString()}`;
		const response = await fetch(url, { headers });
		const result = await response.json();

		if (result?.header?.statut !== 200) return [];
		if (!result?.etablissements) return [];
		const nextCursor = result.header.curseurSuivant;
		await new Promise((resolve) => setTimeout(resolve, 2100));

		return nextCursor !== cursor
			? [...result.etablissements, ...(await fetchPage(nextCursor))]
			: result.etablissements;
	};
	return fetchPage();
};

export const fetchSirenDataById = async (sirenId) => {
	const params = new URLSearchParams({
		q: `siren:${sirenId}`,
		masquerValeursNulles: "true",
	});

	try {
		const response = await fetch(`${apiUrl}/siren?${params}`, {
			headers,
		});
		const result = await response.json();
		await new Promise((resolve) => setTimeout(resolve, 2020));

		const structure = {
			siren: sirenId,
			siret: null,
		};

		if (result?.header?.statut !== 200 || !result.unitesLegales?.[0]) {
			return structure;
		}

		const uniteLegale = result.unitesLegales[0];
		const periode = uniteLegale.periodesUniteLegale?.[0] || {};

		// Direct fields from uniteLegale
		const directFields = [
			"dateCreationUniteLegale",
			"identifiantAssociationUniteLegale",
			"sigleUniteLegale",
			"dateDernierTraitementUniteLegale",
			"categorieEntreprise",
		];

		// Fields from the first period
		const periodFields = [
			"dateDebut",
			"dateFin",
			"denominationUniteLegale",
			"nomUniteLegale",
			"nomUsageUniteLegale",
			"denominationUsuelle1UniteLegale",
			"denominationUsuelle2UniteLegale",
			"denominationUsuelle3UniteLegale",
			"etatAdministratifUniteLegale",
			"nicSiegeUniteLegale",
			"categorieJuridiqueUniteLegale",
			"activitePrincipaleUniteLegale",
			"nomenclatureActivitePrincipaleUniteLegale",
			"changementEtatAdministratifUniteLegale",
			"changementNomUniteLegale",
			"changementNomUsageUniteLegale",
			"changementDenominationUniteLegale",
			"changementDenominationUsuelleUniteLegale",
			"changementCategorieJuridiqueUniteLegale",
		];

		// Add direct fields
		for (const field of directFields) {
			if (uniteLegale[field]) {
				structure[field] = uniteLegale[field];
			}
		}

		// Add period fields
		for (const field of periodFields) {
			if (periode[field]) {
				structure[field] = periode[field];
				if (field === "nicSiegeUniteLegale") {
					structure.siret = sirenId + periode[field];
				}
			}
		}

		// Handle categories juridiques
		if (uniteLegale.periodesUniteLegale) {
			const categories = [
				...new Set(
					uniteLegale.periodesUniteLegale
						.map((p) => p.categorieJuridiqueUniteLegale)
						.filter(Boolean),
				),
			];

			if (categories.length > 0) {
				structure.categoriesJuridiques = categories.join(";");
				structure.categoriesJuridiquesCompte = categories.length;
			}
		}

		return structure;
	} catch (error) {
		console.error("Error fetching SIREN data:", error);
		return { siren: sirenId, message: error.message };
	}
};

export const fetchSiretDataById = async (siretId) => {
	const structure = {
		siren: siretId.slice(0, 9),
		siret: siretId,
	};

	const params = new URLSearchParams({
		q: `siret:${siretId}`,
		masquerValeursNulles: "true",
	});

	try {
		const response = await fetch(`${apiUrl}/siret?${params}`, {
			headers,
		});
		const result = await response.json();
		await new Promise((resolve) => setTimeout(resolve, 2020));

		if (result?.header?.statut !== 200 || !result.etablissements?.[0]) {
			return structure;
		}

		const etablissement = result.etablissements[0];
		const fields = [
			["etablissementSiege"],
			["dateCreationEtablissement"],
			["dateDernierTraitementEtablissement"],
			["uniteLegale", "etatAdministratifUniteLegale"],
			["uniteLegale", "dateCreationUniteLegale"],
			["uniteLegale", "sigleUniteLegale"],
			["uniteLegale", "denominationUniteLegale"],
			["uniteLegale", "categorieJuridiqueUniteLegale"],
			["adresseEtablissement", "numeroVoieEtablissement"],
			["adresseEtablissement", "dernierNumeroVoieEtablissement"],
			["adresseEtablissement", "typeVoieEtablissement"],
			["adresseEtablissement", "libelleVoieEtablissement"],
			["adresseEtablissement", "complementAdresseEtablissement"],
			["adresseEtablissement", "codePostalEtablissement"],
			["adresseEtablissement", "libelleCommuneEtablissement"],
			["adresseEtablissement", "codePaysEtrangerEtablissement"],
			["adresseEtablissement", "libellePaysEtrangerEtablissement"],
			["adresseEtablissement", "libelleCommuneEtrangerEtablissement"],
			["adresseEtablissement", "identifiantAdresseEtablissement"],
			["adresseEtablissement", "codeCommuneEtablissement"],
			["periodesEtablissement", "dateDebut"],
			["periodesEtablissement", "etatAdministratifEtablissement"],
			["periodesEtablissement", "changementEnseigneEtablissement"],
			["periodesEtablissement", "changementEtatAdministratifEtablissement"],
		];

		for (const [parent, child] of fields) {
			if (!child) {
				if (etablissement[parent]) {
					structure[parent] = etablissement[parent];
				}
				continue;
			}

			const parentObj = etablissement[parent];
			if (!parentObj) continue;

			const value =
				parent === "periodesEtablissement"
					? parentObj[0]?.[child]
					: parentObj[child];

			if (value !== undefined) {
				structure[child] = typeof value === "number" ? String(value) : value;
			}
		}

		// Special cases
		if (etablissement.uniteLegale?.nicSiegeUniteLegale) {
			structure.siretSiege =
				structure.siren + etablissement.uniteLegale.nicSiegeUniteLegale;
		}

		if (
			etablissement.adresseEtablissement
				?.coordonneeLambertAbscisseEtablissement &&
			etablissement.adresseEtablissement?.coordonneeLambertOrdonneeEtablissement
		) {
			structure.coordonneeEtablissement = `${etablissement.adresseEtablissement.coordonneeLambertAbscisseEtablissement},${etablissement.adresseEtablissement.coordonneeLambertOrdonneeEtablissement}`;
		}
		return structure;
	} catch (error) {
		console.error("Error fetching SIRET data:", error);
		return {
			...structure,
			message: error.message,
		};
	}
};
