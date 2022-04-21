# Authentification

---

Afin d'obtenir un token d'accès à l'API, et accéder au routes protégées, il est nécessaire de se connecter avec un compte utilisateur.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "username": "<username>", "password": "<user-password>"} https://api.paysage.dataesr.ovh/auth/signin

> {
  "accessToken": "123",
  "refreshToken": "123",
}
```

Vous obtiendrez en réponse un token d'accès, `accessToken` et un token de rafraichissement `refreshToken`

## Token d'accès

Le token d'accès permet d'authentifier l'utilisateur à chaque requète api.
Ajoutez simplement au `HEADERS` de la requète `{ "Authorization": "Bearer <accessToken>" }`. 
Ce token n'est valable que pour un temps limité.
Dans le cas ou le token expire et/ou le token n'est pas passé dans les `HEADERS`, l'api répondra par le code 401.
```json
{ "message": "Vous devez être connecté" }
```

## Raffraichir le token d'accès

Si le token d'acces de l'utilisateur est expiré, celui-ci peut être renouvellé grâce au `refreshToken`.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "refreshToken": "<refreshToken>" } https://api.paysage.dataesr.ovh/auth/refresh-access-token

> {
  "accessToken": "123",
  "refreshToken": "123",
}
```