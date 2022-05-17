export function getDate(d) {
  let aDate = new Date();
  if (typeof d !== 'undefined') {
    aDate = new Date(d);
  }
  return {
    id: 1, // TODO
    day: aDate.getDate(),
    month: aDate.getMonth() + 1,
    year: aDate.getFullYear(),
  };
}

const Matchers = {
  getNaming(denominations) {
    return ({
      id: 1,
      officialName: denominations[0].Libelle,
      usualName: denominations[0].Libelle2,
      shortName: denominations[0]['494486X85X1267'],
      nameEn: denominations[0]['494486X85X1267'],
      acronymFr: denominations[0]['494486X85X2681'],
      acronymEn: '',
      main: true,
      startDate: getDate(denominations[0].startdate),
      createdBy: 'init',
      createdAt: getDate(),

      // "id": 0,
      // "structureId": "string",
      // "officialName": "string",
      // "usualName": "string",
      // "shortName": "string",
      // "brandName": "string",
      // "nameEn": "string",
      // "acronymFr": "string",
      // "acronymEn": "string",
      // "otherName": ["string"],
      // "startDate": "string",
      // "endDate": "string",
      // "comment": "string",
      // "article": "à l'",
      // "createdBy": {
      //   "id": "string",
      //   "username": "string",
      //   "avatar": "string"
      // },
      // "updatedBy": {
      //   "id": "string",
      //   "username": "string",
      //   "avatar": "string"
      // },
      // "createdAt": "2022-02-14T13:11:17.436Z",
      // "updatedAt": "2022-02-14T13:11:17.436Z"
    });
  },

  getIds(ids) {
    return (
      Object.keys(ids).map((ident) => ({
        id: ids[ident][0].Id,
        type: ident,
        active: ids[ident][0].etat === 'A',
        startDate: getDate(ids[ident][0].startdate),
        createdBy: 'init',
        createdAt: getDate(),
      }))
    );
  },

  getLegalPersonalities() {
    return [];
  },

  getCategories(categories) {
    if (!categories) return [];
    return categories.map((cat) => ({
      id: 1, // TODO
      longNameFr: cat.Parent,
      createdBy: 'init',
      createdAt: getDate(),
    }));
  },

  getWebsitePages(variables) {
    if (!variables) return {};
    return {
      id: 1, // TODO
      organisationPageUrl: variables.SitePrincipal,
      createdBy: 'init',
      createdAt: getDate(),
    };
  },

  getSocialMedia(socials) {
    if (!socials) return [];
    const socialMediaList = [];
    if (socials?.Wikipedia) {
      Object.keys(socials.Wikipedia).forEach((langKey) => {
        socialMediaList.push({
          id: 'Wikipedia',
          type: socials.Wikipedia[langKey].Langue,
          lang: langKey,
          account: socials.Wikipedia[langKey].wikipedia,
          createdBy: 'init',
          createdAt: getDate(),
        });
      });
    }
    if (socials?.SitesExternes?.Hal) {
      socialMediaList.push({
        id: 'Hal',
        type: 'Hal',
        account: socials.SitesExternes.Hal,
        createdBy: 'init',
        createdAt: getDate(),
      });
    }
    if (socials?.SitesExternes?.ServicePublic) {
      socialMediaList.push({
        id: 'ServicePublic',
        type: 'ServicePublic',
        account: socials.SitesExternes.ServicePublic,
        createdBy: 'init',
        createdAt: getDate(),
      });
    }
    const addSocial = (s) => {
      if (socials?.ComptesSociaux?.Twitter) {
        socialMediaList.push({
          id: s,
          type: s,
          account: socials.ComptesSociaux[s],
          createdBy: 'init',
          createdAt: getDate(),
        });
      }
    };
    const socialsList = ['Twitter', 'Facebook', 'Linkedin', 'franceculture'];
    socialsList.forEach((s) => {
      addSocial(s);
    });

    return socialMediaList;
  },

  getLocalisation(localisation) {
    if (!localisation) return {};
    return {
      id: 1,
      address: localisation.adresse,
      city: localisation.com_nom,
      country: localisation['353588X52X595PAYS'],
      lat: localisation?.gps?.split(',')[0],
      ln: localisation?.gps?.split(',')[1],
      startDate: getDate(localisation.startdate),
      createdBy: 'init',
      createdAt: getDate(),
    };
  },
};

export default Matchers;
