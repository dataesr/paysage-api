---
tags: [OVERVIEW]
---

# Bienvenue sur la documentation de l'API Paysage.

## Schémas
---

### Content-Type
L'accès API se fait uniquement à l'adresse `[hostname]`. Les requètes et les réponses se font toutes au format JSON.

### Champs
Les champs vides ne sont pas omis et renvoyés `null` si le type du champs n'est pas ni un tableau, ni un objet.
Un tableau vide `[]` est renvoyé dans le cas d'un tableau. Un objet vide `{}` est renvoyé dans le cas d'un objet.
```json
{
  "id": "G9uJm",
  "usualNameFr": "Structure à Dresde (Allemagne)",
  "createdBy": {
    "id": "666340OY",
    "username": "init",
    "avatar": null
  },
  "createdAt": "2022-02-25T12:24:34.011Z",
  "updatedBy": {},
  "parents": [],
  "childs": [],
  "usualNameEn": null,
  "shortNameEn": null,
  "shortNameFr": null,
  "acronymFr": null,
  "pluralNameFr": "Les structures à Dresde (Allemagne)",
  "otherNamesFr": [
    "Dresde (Allemagne)"
  ],
  "otherNamesEn": [],
  "descriptionFr": null,
  "descriptionEn": null,
  "comment": null,
}
```
### Représentations détaillées et représentations simplifiés.
Les objets paysage ont la plupart du temps deux représentations.
  - La première, détaillée est accessible à l'url propre de la resource. Par exemple:
  ```sh
  $ curl -X GET -H "Content-Type: application/json" -H "Authorization: <accessToken> https://api.paysage.dataesr.ovh/categories/G9uJm"
  ```
  - La deuxième, simplifiée peut être utilisé dans des requètes de search et/ou lorsque les données d'un objets sont rappatriées dans la représentation d'un autre. Par exemple:
  ```sh
  $ curl -X GET -H "Content-Type: application/json" -H "Authorization: <accessToken> https://api.paysage.dataesr.ovh/categories/"
  ```

  Les détails sur l'auteur et la date de creation/modification n'est disponible que dans l'objet détaillé.

### Dates

#### Dates système
Les dates du système applicatif sont au format `YYYY-MM-DDTHH:MM:SSZ`. Par exemple, les dates de création et de modification des objets:
```json
{ 
  ...,
  "createdAt": "2022-02-25T12:24:34.011Z",
  "updatedAt": "2022-02-25T12:24:34.011Z"
}
```

#### Dates approximatives
Beaucoup de dates dans les modèles sont au format `YYYY-MM-DD`. 
Lorsque la date est approximative, les valeurs du mois et du jour peuvent être omises.
Par exemple une structure peut avoir une date d'ouverture pour laquelle:
  - l'année, le mois et le jour sont connus: `2022-03-25` est une date valide.
  - l'année et le mois sont connus, le jour est inconnu. `2022-03` est une date valide.
  - seule l'année est connue. `2022` est une date valide.
`2022-` ou `2022-03-` ne sont pas valides.

## Securité
---

Pour accéder à une route protégée, ajoutez au `HEADERS` de la requète `{ "Authorization": "Bearer <token>" }`.

Pour obtenir ce token, reportez-vous à la section [Authentification](#authentification).

## Codes HTTP
---

| Code | Description  | Détails
| ---  | ---          | ---
| 200	 | OK	          | La requète a réussi et la réponse contient des données.
| 201	 | Created	    | La requète a réussi, une resource à été créee et la réponse contient des données.
| 204	 | No Content	  | La requète a réussi mais la réponse ne contient pas de données.
| 400	 | Bad Request  | La requète comporte des erreurs.
| 401	 | Unauthorized | L'utilisateur n'est pas connecté.
| 403	 | Forbidden    | L'utilisateur n'a pas les droits nécessaires.
| 404	 | Not Found	  | La resource n'existe pas.
| 500	 | Server Error | La requète a échoué de façcon innatendue.


## Erreurs
---

Erreurs renvoyées par l'api:
  - 400: Bad request - La requète ne peut être traitée par le serveur.
  - 401: Unauthorized - L'utilisateur n'est pas connecté.
  - 403: Forbidden - Les droits utilisateur ne sont pas suffisants.
  - 404: Not Found - La resource n'existe pas
  - 500: Serveur Error - Erreur coté serveur

Le format d'erreur est composé d'une clé `message`, décrivant l'erreur et d'une liste `errors` permettant de préciser la ou les raisons de l'erreur:

```json
{
  'message': 'string'
  'errors': [
    {
      'message': 'string',
      'path': 'string',
      'code': 'string'
    }
  ]
}
```

### Erreurs de validation.

Les erreurs de validations sont décrites dans le tableau `errors`.
Dans ce tableau la clé path indique ou se situe l'erreur elle commence généralement par
  - .body pour une erreur dans le payload de la requète
  - .params pour une erreur dans les paramètres
  - .response lorsque le modèle renvoyé n'est pas valide.
La clé `message` donne une indication plus précise de l'erreur repérée à l'endroit indiqué.

## Authentification

Afin d'obtenir un token d'accès à l'API, et accéder au routes protégées, il est nécessaire de se connecter avec un compte utilisateur.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "username": "<username>", "password": "<user-password>"} https://api.paysage.dataesr.ovh/auth/signin

> {
  "accessToken": "123",
  "refreshToken": "123",
}
```

Vous obtiendrez en réponse un token d'accès, `accessToken` et un token de rafraichissement `refreshToken`

### Token d'accès

Le token d'accès permet d'authentifier l'utilisateur à chaque requète api.
Ajoutez simplement au `HEADERS` de la requète `{ "Authorization": "Bearer <accessToken>" }`. 
Ce token n'est valable que pour un temps limité.
Dans le cas ou le token expire et/ou le token n'est pas passé dans les `HEADERS`, l'api répondra par le code 401.
```json
{ "message": "Vous devez être connecté" }
```

### Raffraichir le token d'accès

Si le token d'acces de l'utilisateur est expiré, celui-ci peut être renouvellé grâce au `refreshToken`.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "refreshToken": "<refreshToken>" } https://api.paysage.dataesr.ovh/auth/refresh-access-token

> {
  "accessToken": "123",
  "refreshToken": "123",
}
```

[hostname]: api.paysage.staging.dataesr.ovh
