# Les resources de Paysage

L'accès aux resources se fait à l'adresse `paysage-api.staging.dataesr.ovh`, uniquement via le protocol HTTPS.
Les requètes et les réponses se font toutes au format JSON.
Les routes suivent les principes de l'architecture REpresentational State Transfer (REST) et sont documentées via un document OpenAPI.

## Principes généraux
---

### Schémas

#### Représentations détaillées et représentations simplifiés.
Les objets paysage ont la plupart du temps deux représentations.
  - La première, détaillée, est accessible à l'url propre de la resource. Par exemple:
  ```sh
  $ curl \
      -X GET \
      -H "Content-Type: application/json" \
      -H "Authorization: <accessToken>" \
      https://api.paysage.dataesr.ovh/<collection>/<resourceId>
  ```
  - La deuxième, simplifiée, peut être utilisée dans des requètes de search et/ou lorsque les données d'un objet sont embarquées dans la représentation d'un autre.
  
  Les détails sur l'auteur et les dates de création et de modification ne sont disponibles que dans l'objet détaillé.

#### Modèles d'écriture.
Les modèles permettant l'écriture des données sur les requètes POST, PUT et PATCH, sont documentés avec le suffix Payload.
Par exemple pour creéer une structure le modèle sera StructureCreatePayload.

Lorsque les modèles de création et de modification sont équivalents, un seul modèle est utilisé, par exemple StructureIdentifierPayload.
Ils diffèrent néanmoins sur les champs requis et il est nécessaire de se référer au modèle décrit dans chaque route.

#### Dates système et dates approximatives

Les dates du système applicatif sont au format `YYYY-MM-DDTHH:MM:SSZ`. Par exemple, les dates de création et de modification des objets:
```json
{ 
  ...,
  "createdAt": "2022-02-25T12:24:34.011Z",
  "updatedAt": "2022-02-25T12:24:34.011Z"
}
```

En revanche, beaucoup de dates dans les modèles sont au format `YYYY-MM-DD`. 
Lorsque la date est approximative, les valeurs du mois et du jour peuvent être omises.
Par exemple une structure peut avoir une date d'ouverture pour laquelle:
  - l'année, le mois et le jour sont connus: `2022-03-25` est une date valide.
  - l'année et le mois sont connus, le jour est inconnu. `2022-03` est une date valide.
  - seule l'année est connue. `2022` est une date valide.
`2022-` ou `2022-03-` ne sont pas valides.

#### Champs vides
Les champs vides ne sont pas omis et renvoient `null` si le type du champs n'est ni un tableau, ni un objet.
Un tableau vide `[]` est renvoyé dans le cas d'un tableau. Un objet vide `{}` est renvoyé dans le cas d'un objet.
```json
{
  "id": "G9uJm",
  "emptyString": null,
  "emptyNumber": null,
  "emptyObject": {},
  "emptyArray": [],
}
```

### Erreurs
---

Erreurs renvoyées par l'api:
  - 400: Bad Request - La requète ne peut être traitée par le serveur.
  - 401: Unauthorized - L'utilisateur n'est pas connecté.
  - 403: Forbidden - Les droits utilisateur ne sont pas suffisants.
  - 404: Not Found - La resource n'existe pas
  - 500: Server Error - Erreur coté serveur

Le format d'erreur est composé d'une clé `message`, décrivant l'erreur et d'une liste `errors` permettant de préciser la ou les raisons de l'erreur:

```json
{
  "message": "string"
  "errors": [
    {
      "message": "string",
      "path": "string",
      "code": "string"
    }
  ]
}
```

#### Erreurs de validation.

Les erreurs de validation sont décrites dans le tableau `errors`.
Dans ce tableau, la clé `path` indique où se situe l'erreur. Elle commence généralement par
  - .body pour une erreur dans le payload de la requête
  - .params pour une erreur dans les paramètres
  - .response lorsque le modèle renvoyé n'est pas valide.
La clé `message` donne une indication plus précise de l'erreur repérée à l'endroit indiqué.


### Interaction HTTP

#### Verbes HTTP

| Verbe  |	Action
| ---    | ---
| GET	   | Renvoyer une représentation d'une resource.
| POST	 | Créer une resource.
| PATCH	 | Modifier une resource avec des données partielles. 
| PUT	   | Créer ou remplacer une resource.
| DELETE | Supprimer une resource.

#### Codes HTTP

| Code | Description  | Détails
| ---  | ---          | ---
| 200	 | OK	          | La requête a réussi et la réponse contient des données.
| 201	 | Created	    | La requête a réussi, une resource a été créée. La réponse contient des données.
| 204	 | No Content	  | La requête a réussi mais la réponse ne contient pas de données.
| 301	 | No Content	  | La ressource a été redirigée vers une autre. Voir le header 'Location' pour suivre la redirection.
| 400	 | Bad Request  | La requête comporte des erreurs.
| 401	 | Unauthorized | L'utilisateur n'est pas connecté.
| 403	 | Forbidden    | L'utilisateur n'a pas les droits nécessaires.
| 404	 | Not Found	  | La resource n'existe pas.
| 500	 | Server Error | La requête a échoué de façon inattendue.



### Sécurité
---

Les routes sont protégées et un utilisateur doit être connecté afin d'effectuer une requête. Pour accéder à une route, ajoutez au `HEADERS` de la requête `{ "Authorization": "Bearer <token>" }`.

Pour obtenir ce token, reportez-vous à la section [Authentification](#authentification).
En cas d'absence de token ou de token invalide, un code 401 est renvoyé.


### DELETE et Soft deletes
