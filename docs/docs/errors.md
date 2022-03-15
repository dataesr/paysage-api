---
tags: [OVERVIEW]
---

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
