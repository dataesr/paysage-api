---
tags: [OVERVIEW]
---

# Bienvenue sur la documentation de l'API Paysage.

## Schémas

L'accès API se fait uniquement à l'adresse paysage.staging.dataesr.ovh. Les requètes et les réponses se font au format JSON.
Les champs vides ne sont pas omis et renvoyé null, ou vide. Les dates du système applicatif sont au format `YYYY-MM-DDTHH:MM:SSZ` alors que beaucoup de dates dans les modèles sont au format `YYYY-MM-DD`. Les valeurs du mois et du jour peuvent être omises. Par exemple `2022-03` ou `2022` sont des dates valides. `2022-` ne l'est pas.

## Securité

Pour accéder à une route protégée, ajoutez un `HEADER` { "Authorization": "Bearer <token>" }
Pour obtenir ce token, reportez vous à la section Authentification.


## Erreurs

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
