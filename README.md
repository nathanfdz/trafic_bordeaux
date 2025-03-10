# MongoDB vs SGBDR : Gestion de l'évolution du schéma

## Peut-on ajouter des colonnes dans un document MongoDB ?

Oui, MongoDB est **schéma-flexible**. Contrairement aux bases de données relationnelles (SGBDR), il est possible d'ajouter de nouveaux champs dans un document **sans nécessiter de migration**.

## Comment évolue un schéma dans un SGBDR classique ?

Dans un **Système de Gestion de Base de Données Relationnelle (SGBDR)** comme MySQL ou PostgreSQL, l'évolution du schéma passe par des **migrations SQL** :
- Ajout ou suppression de colonnes avec `ALTER TABLE`.
- Modification des types de données ou contraintes.
- Nécessité d'adapter toutes les entrées existantes.

Ces modifications sont souvent coûteuses en termes de performance et nécessitent une planification rigoureuse.

## Comment gérer l’évolution du schéma dans MongoDB ?

En NoSQL, l'évolution du schéma est plus souple mais nécessite quelques précautions :

1. **Ajouter des champs sans supprimer les anciens** : Les nouveaux champs peuvent être introduits dans les documents sans impact sur les documents existants.
2. **Gérer les valeurs manquantes** :
   - Prendre en compte les documents sans le nouveau champ pour éviter les erreurs.
   - Utiliser des valeurs par défaut dans le code applicatif.
3. **Utiliser Mongoose (Node.js) ou un ORM pour structurer les données** :
   - Définir des **schemas** pour assurer la validation des données.
   - Appliquer des règles métier pour éviter l’incohérence des documents.

MongoDB permet donc une plus grande flexibilité, mais demande **une gestion rigoureuse du modèle de données** dans l’application pour garantir l’intégrité et la compatibilité des données.