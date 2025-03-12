"# trafic_bordeaux"
# NoSQL vs SGBDR

### Peut-on ajouter des colonnes dans un document MongoDB ?
Oui ! Contrairement aux bases de données relationnelles (SGBDR), MongoDB est **schéma-flexible**. Cela signifie qu'on peut ajouter de nouvelles propriétés à un document sans modifier toute la collection.

### Évolution du schéma en SGBDR ?
En SQL, on utilise des **migrations** (ALTER TABLE) pour modifier un schéma. Par exemple, en Laravel ou Django, on écrit des **scripts de migration** pour ajouter ou modifier des colonnes.

### Comment gérer l'évolution du schéma dans MongoDB ?
Dans MongoDB, il n’y a **pas de schéma strict**. On peut utiliser des **validateurs** pour forcer une structure ou ajouter un champ `version` pour gérer les évolutions de données.

