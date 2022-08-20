# Authentification


## Création de compte

Plusieurs étapes sont nécéssaire à la création d'un compte paysage avant que l'utilisateur puisse acceder aux resources.

### Etape 1: Création du compte
Une utilisateur peut créer un compte en renseignant son email, son prénom, son nom et un mot de passe.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "firstName": "<user-firstname>", "lastName": "<user-lastname>", "password": "<user-password>"} https://api.paysage.dataesr.ovh/auth/signup

> {
  "message": "Compte crée. Veuillez vous connecter."
}
```
Le compte utilisateur est alors crée, mais le login reste impossible.

### Etape 2: Confirmation par un administrateur de l'utilisateur.

Une administrateur paysage doit confirmer l'utilisateur avant que celui-ci puisse s'authentifier.
```sh
$ curl -X POST -H "Content-Type: application/json" https://api.paysage.dataesr.ovh/admin/users/:id/confirm
```
Cette route n'est utilisable que pour un utilisateur avec le role `admin`. 401 sera renvoyé dans les autres cas.
Un email de confirmation préviendra l'utilisateur qu'il peut se connecter à l'application.

### Etape 3: Connexion deux facteurs obligatoire.

Une connexion de type 2FA est obligatoire sur paysage, afin de reconfirmer l'addresse email de l'utilisateur à chaque nouvelle connexion.
Lorsque l'utilisateur souhaite se connecter, envoyez la requète suivante afin de générer l'envoie d'un email contenant un code d'identification.

```sh
$ curl -X POST -H "Content-Type: application/json" -H "X-Paysage-OTP-Method: email" -d { "email": "<user-email>", "password": "<user-password>" } https://api.paysage.dataesr.ovh/auth/signin

> {
  "message": "Authentification double facteur requise. Un nouveau code à été envoyé à l'adresse <user-email>. Code utilisable jusqu'au <date>"
}
```
Une fois le code entré par l'utilisateur, renvoyez:
```sh
$ curl -X POST -H "Content-Type: application/json" -H "X-Paysage-OTP: <user-otp>" -d { "email": "<user-email>", "password": "<user-password>" } https://api.paysage.dataesr.ovh/auth/signin

> {
  "accessToken": "Bearer <accessToken>",
  "refreshToken": "Bearer <refreshToken>",
}
```

### Token d'accès

Le token d'accès permet d'authentifier l'utilisateur à chaque requète api.
Ajoutez simplement au `HEADERS` de la requète `{ "Authorization": "Bearer <accessToken>" }`. 
Ce token n'est valable que pour un temps limité à 15 minutes.
Dans le cas ou le token expire et/ou le token n'est pas passé dans les `HEADERS`, l'api répondra par le code 401.
```json
{ "message": "Vous devez être connecté" }
```
### Raffraichir le token d'accès

Si le token d'accès de l'utilisateur est expiré, celui-ci peut être renouvellé grâce au `refreshToken`.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "refreshToken": "<refreshToken>" } https://api.paysage.dataesr.ovh/auth/token

> {
  "accessToken": "Bearer <accessToken>",
  "refreshToken": "Bearer <refreshToken>",
}
```

### Se déconnecter
```sh
$ curl -X POST -H "Content-Type: application/json" -H "Authorization: <accessToken>" https://api.paysage.dataesr.ovh/signout

> { "message": "Vous êtes déconecté." }
```


