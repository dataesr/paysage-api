import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-annelis-paysage-etablissements';

const getWebsite = (structure) => {
  const websites = structure.websites?.filter((website) => website.type === "website") || [];
  // Priority: French first, then undefined, then English, then any other
  return websites.find(w => w.language === "fr")?.url ||
    websites.find(w => w.language === "Fr")?.url ||
    websites.find(w => w.language === undefined)?.url ||
    websites.find(w => w.language === "en")?.url ||
    websites.find(w => w.language === "En")?.url ||
    websites[0]?.url || "";
};

export default async function exportFrEsrAnnelisPaysageEtablissements() {
  const supervisingMinisters = new Map();
  const ministersQuery = await db.collection('supervisingministers').find().toArray();
  for (const s of ministersQuery) {
    supervisingMinisters.set(s.id, s.usualName);
  }

  const getSupervisingMinisters = async (structId) => {
		const ministers = await db
			.collection("relationships")
			.find({ relationTag: "structure-tutelle", relatedObjectId: structId })
			.toArray();

		if (!ministers?.length) return null;
		return ministers
			?.map((minister) => supervisingMinisters.get(minister.resourceId))
			?.join(";");
	};

  const data = await db.collection('identifiers').aggregate([
    { $match: { type: 'annelis' } },
    {
      $lookup: {
        from: 'structures',
        localField: 'resourceId',
        foreignField: 'id',
        pipeline: structuresLightQuery,
        as: 'structure',
      },
    },
    { $set: { structure: { $arrayElemAt: ['$structure', 0] } } },
  ]).toArray();

  for (const d of data) {
    d.structure.supervisingMinisters = await getSupervisingMinisters(d.structure.id);
  }


  const json = data.map(({ structure = {}, ...identifier }) => {
    if (!structure.id) return null;
    const altLib = structure.currentName?.acronymFr
      ? `${structure.currentName?.usualName} (${structure.currentName?.acronymFr})`
      : structure.currentName?.usualName;
    const row = {
      dataset,
      eta_id: identifier.value,
      eta_id_paysage: structure.id,
      eta_uai: structure.identifiers?.filter((i) => i.type === "uai" && i.active === true)?.[0]?.value,
      eta_lib: structure.currentName?.usualName,
      eta_lib_alt: altLib,
      eta_sigle: structure.currentName?.acronymFr,
      eta_lib_court: structure.currentName?.shortName,
      eta_lib_off: structure.currentName?.officialName,
      eta_acronym: structure.currentName?.acronymFr,
      eta_type_paysage: structure.category?.usualNameFr,
      cat_id: structure.categories.map((cat) => cat?.annelisId || '').join(';'),
      cat_id_paysage: structure.categories.map((cat) => cat?.id).join(';'),
      cat_lib_paysage: structure.categories.map((cat) => cat?.usualNameFr).join(';'),
      cat_jur_id: structure.legalcategory?.annelisId,
      cat_jur_id_paysage: structure.legalcategory?.id,
      cat_jur_lib: structure.legalcategory?.longNameFr,
      cat_lib: structure.category?.usualNameFr,
      eta_vague: structure.categories.find((cat) =>
					cat?.usualNameFr.startsWith("Vague"),
				)?.usualNameFr,
			eta_site_web: getWebsite(structure),
			eta_tutelle: structure.supervisingMinisters,
    };
    return row;
  });
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('opendata').deleteMany({ dataset });
    await db.collection('opendata').insertMany(json);
    await session.endSession();
  });

  return { status: 'success', location: `/opendata/${dataset}` };
}
