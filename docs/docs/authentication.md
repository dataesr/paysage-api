# Authentification


## Création de compte

Plusieurs étapes sont nécéssaire à la création d'un compte paysage avant que l'utilisateur puisse acceder aux resources.

### Etape 1: Création du compte
Une utilisateur peut créer un compte en renseignant son email, son prénom, son nom et un mot de passe.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "firstName": "<user-firstname>", "lastName": "<user-lastname>", "password": "<user-password>"} https://api.paysage.dataesr.ovh/auth/signup

> {
  "message": "Un code de confirmation à été envoyé à l'adresse <user-email>"
}
```
Le compte utilisateur est alors crée, mais le login reste impossible.

### Etape 2: Validation de l'adresse email.
A la fin de l'étape 1, une code d'activation est envoyé à l'adresse mail de l'utilisateur, pour vérifier que cette adresse est valide.
Afin de valider l'email, la requète suivant est nécessaire:
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "otp": "<user-otp>" } https://api.paysage.dataesr.ovh/auth/validate-email

> {
  "message": "Addresse de l'utilisateur validée"
}
```
L'addresse mail de l'utilisateur est alors validée, mais le login reste impossible.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "password": "<user-password>" } https://api.paysage.dataesr.ovh/auth/signin

> {
  "message": "Utilisateur inactif"
}
```

### Etape 3: Confirmation par un administrateur de l'utilisateur.

Une administrateur paysage doit confirmer l'utilisateur avant que celui-ci puisse s'authentifier.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>" } https://api.paysage.dataesr.ovh/auth/activate

> {
  "message": "L'utilisateur <user-email> est actif.",
}
```
Cette route n'est utilisable que pour un utilisateur avec le role `admin`. 401 sera renvoyé dans les autres cas.
Un email de confirmation préviendra l'utilisateur qu'il peut se connecter à l'application.

## Authentification

Une fois les trois étapes terminées, l'utilisateur peut se connecter:
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "password": "<user-password>" } https://api.paysage.dataesr.ovh/auth/signin

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

Si le token d'acces de l'utilisateur est expiré, celui-ci peut être renouvellé grâce au `refreshToken`.
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "refreshToken": "<refreshToken>" } https://api.paysage.dataesr.ovh/auth/refresh-access-token

> {
  "accessToken": "Bearer <accessToken>",
  "refreshToken": "Bearer <refreshToken>",
}
```

### Se déconnecter

...

## Revalidation de l'addresse email
Toules les X mois, l'utilisateur doit revalider son adresse email.
Le login ainsi que le raffraichissement de token seront impossible avant que l'utilisateur n'ai procédé à la revalidation.
Dans ce cas, un essaie d'authentification enverra un email avec un code permettant de valider à nouveau l'adresse email.
Pour la revalidation, procédez de la même facon que pour l'étape 2 d'une création de compte:
```sh
$ curl -X POST -H "Content-Type: application/json" -d { "email": "<user-email>", "otp": "<user-otp>" } https://api.paysage.dataesr.ovh/auth/validate-email

> {
  "message": "Addresse de l'utilisateur validée"
}
```
L'addresse mail de l'utilisateur est alors validée, mais le login reste impossible.

## Decodage des Tokens
Les tokens contiennent des informations sur le profile de l'utilisateur. Apres décodage, vous pouvez accéder à l'objet:
```json
{
  expiresIn: <date>
  type: <access/refresh>
  user: {
    id: <user-id>,
    email: <email>,
    username: <username>,
    mustRevalidateEmailBefore: <mustRevalidateEmailBefore>,
    role: <role>,
    groups: [{
      id: <group-id>,
      name: <group-name>
    }]
    devices: [{
      name: <device-name>
    }]
  }
}
```


