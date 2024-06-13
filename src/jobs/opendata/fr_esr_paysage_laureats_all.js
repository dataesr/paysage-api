import { client, db } from '../../services/mongo.service';
import readQuery from '../../api/commons/queries/relations.query';
import structuresLightQuery from '../../api/commons/queries/structures.light.query';
import categoriesLightQuery from '../../api/commons/queries/categories.light.query';

const dataset = 'fr_esr_paysage_laureats_all';

export default async function exportFrEsrPaysageLaureatAll() {
    const data = await db.collection('relationships').aggregate([
        { $match: { relationTag: 'laureat' } },
        ...readQuery,
        {
            $lookup: {
                from: 'relationships',
                localField: 'resourceId',
                foreignField: 'resourceId',
                as: 'porteurs',
                pipeline: [
                    { $match: { relationTag: 'prix-porteur' } },
                    { $project: { _id: 0, relatedObjectId: 1 } },
                ],
            },
        },
        {
            $lookup: {
                from: 'structures',
                localField: 'porteurs.relatedObjectId',
                foreignField: 'id',
                as: 'porteurs',
                pipeline: structuresLightQuery,
            },
        },
        {
            $lookup: {
                from: 'relationships',
                localField: 'resourceId',
                foreignField: 'resourceId',
                as: 'categories',
                pipeline: [
                    { $match: { relationTag: 'prix-categorie' } },
                    { $project: { _id: 0, relatedObjectId: 1 } },
                ],
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categories.relatedObjectId',
                foreignField: 'id',
                as: 'categories',
                pipeline: categoriesLightQuery,
            },
        },
        {
            $lookup: {
                from: 'weblinks',
                localField: 'resourceId',
                foreignField: 'resourceId',
                as: 'websites',
                pipeline: [
                    { $match: { type: 'website' } },
                ],
            },
        },

    ]).toArray();
    // console.log(`Exporting ${data.length} relations for dataset ${dataset}`, data[0].websites);
    const json = data.map(e => {
        const wikidata = e.relatedObject.identifiers?.filter((i) => (i.type === 'wikidata'))
            .sort((a, b) => a?.startDate?.localeCompare(b?.startDate)).map((i) => i.value).join('|') || null;
        const otherAssociatedObjectIdentifiers = e.otherAssociatedObjects?.flatMap((i) => i.identifiers)
        return {
            prix_laureat_identifiant: e.id,
            prix_annee: e.startDate,
            prix_identifiant: e.resourceId,
            prix_libelle: e.resource.displayName,
            prix_detail: e.resource.descriptionFr,
            prix_libelle_francais: e.resource.nameFr,
            prix_libelle_anglais: e.resource.nameEn,
            prix_categories: e.categories?.map((c) => c.usualNameFr),
            prix_site_internet: e.websites?.map((w) => w?.url).join(';'),
            prix_identifiant_wikidata: wikidata,
            prix_element_wikidata: wikidata ? `https://www.wikidata.org/entity/${wikidata}` : null,
            prix_porteurs_identifiant: e.porteurs?.map((p) => p.id).join(';'),
            prix_porteurs_libelle: e.porteurs?.map((p) => p.displayName).join(';'),
            laureat_type: e.relatedObject?.collection === 'persons' ? 'Personne' : 'Structure',
            laureat_identifiant: e.relatedObject.id,
            laureat_libelle: e.relatedObject.displayName,
            laureat_personne_prenom: e.relatedObject.firstName,
            laureat_personne_nom: e.relatedObject.lastName,
            laureat_personne_genre: e.relatedObject.gender,
            laureat_structures_associees_identifiant: e.otherAssociatedObjectIds,
            laureat_structures_associees_libelle: e.otherAssociatedObjects?.map((i) => (i.displayName)),
            laureat_identifiant_wikidata: e.relatedObject.identifiers?.filter((i) => (i.type === 'wikidata')).map((i) => i.value) || null,
            laureat_identifiant_idref: e.relatedObject.identifiers?.filter((i) => (i.type === 'idref')).map((i) => i.value) || null,
            laureat_identifiant_orcid: e.relatedObject.identifiers?.filter((i) => (i.type === 'orcid')).map((i) => i.value) || null,
            laureat_identifiant_uai: e.relatedObject.identifiers?.filter((i) => (i.type === 'uai')).map((i) => i.value) || null,
            laureat_identifiant_siret: e.relatedObject.identifiers?.filter((i) => (i.type === 'siret')).map((i) => i.value) || null,
            laureat_identifiant_rnsr: e.relatedObject.identifiers?.filter((i) => (i.type === 'rnsr')).map((i) => i.value) || null,
            laureat_identifiant_cnrs: e.relatedObject.identifiers?.filter((i) => (i.type === 'cnrs')).map((i) => i.value) || null,
            laureat_identifiant_ed: e.relatedObject.identifiers?.filter((i) => (i.type === 'ed')).map((i) => i.value) || null,
            laureat_identifiant_ror: e.relatedObject.identifiers?.filter((i) => (i.type === 'ror')).map((i) => i.value) || null,
            laureat_structures_associees_identifiant_wikidata: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'wikidata')).map((i) => i.value),
            laureat_structures_associees_identifiant_idref: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'idref')).map((i) => i.value),
            laureat_structures_associees_identifiant_orcid: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'orcid')).map((i) => i.value),
            laureat_structures_associees_identifiant_uai: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'uai')).map((i) => i.value),
            laureat_structures_associees_identifiant_siret: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'siret')).map((i) => i.value),
            laureat_structures_associees_identifiant_rnsr: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'rnsr')).map((i) => i.value),
            laureat_structures_associees_identifiant_cnrs: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'cnrs')).map((i) => i.value),
            laureat_structures_associees_identifiant_ed: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'ed')).map((i) => i.value),
            laureat_structures_associees_identifiant_ror: otherAssociatedObjectIdentifiers.filter((i) => (i.type === 'ror')).map((i) => i.value),

        }
    });
    console.log(json[0]);
    // const session = client.startSession();
    // await session.withTransaction(async () => {
    //     await db.collection('opendata').deleteMany({ dataset });
    //     await db.collection('opendata').insertMany(json);
    //     await session.endSession();
    // });

    return { status: 'success', location: `/opendata/${dataset}` };
}