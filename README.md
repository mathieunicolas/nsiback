# Utilisation
- depuis l'UI, on créé des utilisateurs, élève et prof
- on sélectionne un profil : 
  - la sélection d'un profil envoie une POST sur /auth/login
  - on récupère un cookie d'authentification qui contient un JWT
  - une fois loggé, on envoie une GET sur /activities, et la requête est accompagnée du cookie
- avec un prof, on créé une ou plusieurs activités
- avec un élève, on assigne une activité en renseignant l'ID d'une activité prof
- [ ] ajouter dans l'UI le listing des activités par master 

# Commentaires
## Authentification

### Technique

L'auth est mise en place avec le module `Passport` : https://docs.nestjs.com/recipes/passport

Ce module permet visiblement l'ajout de stratégies d'auth supplémentaires, donc à creuser, mais je pense que ce sera intéressant quand on voudra ajouter d'autres solutions d'authentification.

### Pratique

Envoyer une requête POST sur `auth/login` qui contient dans le body les champs `username` et `password` renvoie le jwt, mais aussi pose un cookie qui contient ce jwt.

MAIS j'ai eu une erreur qui me dit que `credentials: 'include'` n'est pas valide avec un CORS setup sur `origin: '*'`. Du coup pour l'instant j'ai mis `origin: true, credentials: true` pour la config du CORS.

Je ne comprends pas encore tout le principe CORS et Credentials, tout ce que je sais pour l'instant c'est que je dois ajouter `credentials: include` dans mes requêtes pour que le cookie revienne depuis le login, et pour que le cookie soit ajouté à la requête pour le reste.

### Roles
La gestion des rôles a son petit article également, à creuser. Il y a plusieurs méthodes présentées, il faudra comparer et faire un choix.

https://docs.nestjs.com/security/authorization

J'ai testé l'implémentation du RBAC classique et ça fonctionne bien. Petite perte de temps sur une galère : je ne retrouvais pas l'objet `user` que le JwtAuthGuard ajoutait à la requête. J'ai appris [ici](https://stackoverflow.com/questions/50801533/nestjs-unable-to-get-user-context-in-rolesguard) que les guards s'exécutent dans un certain ordre (?) et que pour supprimer l'erreur il me semble qu'il a fallu supprimer l'enregistrement du guard au niveau de l'AppModule.

Bon du coup ça fonctionne bien, cf ActivitiesController : la route est accessible aux rôles Prof et Eleve. Si je supprime Role.Eleve, effectivement le user qui a le rôle Eleve se retrouve non autorisé MALGRÉ le fait qu'il soit bien authentifié.

Par contre je récupère le rôle dans le JWT. Bien qu'il ait été signé avant l'émission et décodé après, peut-être qu'il serait plus solide d'aller chercher l'information du rôle dans la db côté backend ? Est-ce que ce serait une couche inutile de sécurité ?

## OpenAPI

Swagger est mis en place et est accessible en navigant sur http://localhost:3000/api  
Le CLI plugin est également setup : https://docs.nestjs.com/openapi/cli-plugin

L'ensemble est pour l'instant très austère, il faudra regarder de plus près aux décorateurs à utiliser pour décrire proprement les endpoints.

## Storage

Le boilerplate est mis en place : https://squareboat.com/open-source/nestjs-boilerplate/storage/

Un `curl -X POST -F 'file=@test.csv' http://localhost:3000/file` va effectivement créer le fichier dans le dossier paramétré dans `app.module.ts`. Pour l'instant c'est `./files`, ce qui créé un sous-dossier à la racine du projet. Ce sous-dossier est ajouté au `.gitignore` pour ne pas polluer le dépôt.

Pour l'instant, ça ne va pas plus loin. Comment gérer ce système de fichiers ? Chaque fichier serait associé à une ligne dans la db qui permettrait un accès au fichier sous réserve de certaines conditions requises ? auth, rôles ?
Il y a peut-être quelque chose à creuser du côté des claims-based authorizations ? 
https://docs.nestjs.com/security/authorization#claims-based-authorization



- navigate to ENT/login?service=https://url.com
- PARAM dans l'URL ticket TICKET
- GET sur /serviceValidate?ticket=TICKET&service=https://url.com
- retour des infos dans le body de la res