---
tags: [OVERVIEW]
---

# Bienvenue sur la documentation Paysage.

Paysage est une application de gestion des données de suivi des acteurs de l'enseignement supérieur de la recherche et de l'innovation. 
Les agents de la Direction générale de l'enseignement supérieur et de l'insertion professionnelle (DGESIP) et de la Direction générale de la recherche et de l'innovation (DGRI) sont résponsables de maintenir les données à jour. 

Des remontés d'information de terrain seront intégrés grace à un interfacage avec Dialogue, une autre application produite par le Ministère de l'enseignement supérieur, de la recherche et de l'innovation.

Paysage, se décompose en deux briques applicatives.
  - Un site internet de consultation et de modification manuelle des données.
  - Une API d'interaction avec la base de donnée. Le présent document se propose de documenter l'utilisation de cette API.

## Objets paysage

Paysage décrit et permet l'interaction avec plusieurs type d'objets.

### Structures
### Personnes
### Projets
### Prix scientifiques

Décrit un prix scientifique.
Les prix ont des relations avec les personnes à travers les lauréats.
Cette relation peut être enrichie par l'identifiant de la structure dans laquelle se trouvait la personne au moment du prix.

### Catégories

Les catégories servent à tagger un ensemble de resources (diverses - tous les autres objets paysage peuvent se voir associer des termes) afin de les associer à un ensemble logique. Ces ensembles divers et variés peuvent être crées à la discression de l'utilisateur. Par exemple pour regrouper les universités, il faudra créer une catégorie "Université" et associer les structures à cette catégorie. 

### Termes

Les termes servent à tagger un ensemble de resources (diverses - tous les autres objets paysage peuvent se voir associer des termes) afin de les associer à un concept (ou terme) particulier. Ces concepts divers et variés peuvent être crées à la discression de l'utilisateur.

### Rôles

Les rôles servent à décrire une relation entre une personne et une structure.
Comme les autres resources, ces roles peuvent être ajoutés et modifiés. Il s'agit d'une resource à part entière, afin que l'utilisateur puisse ajouter des rôles de manière dynamique et les gérer.

###### Notes !

Catégorie 'université' => Liste de Structures => Voir les personnes qui ont un rôle dans les structures de la catégorie Université.

search: catégories avec filtres catégories ! attention , les catégories en filtre sont des catégories associées, pas des parentes (potentiellement mettre catégories parentes en filtre!
