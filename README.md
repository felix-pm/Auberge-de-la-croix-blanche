# Auberge de la Croix Blanche — site vitrine

Site de l'Auberge de la Croix Blanche, hôtel-restaurant à Marcilly-en-Villette (45240), maison établie depuis 1870.

Réalisé en HTML / CSS / JavaScript statique, sans dépendance ni étape de build, à partir des maquettes « Accueil — bureau » faites dans Claude Design.

## Structure

```
index.html              Page d'accueil (one-page : hôtel, restaurant, événements, contact…)
mentions-legales.html   Mentions légales et crédits (champs [À COMPLÉTER])
css/style.css           Styles (variables de couleurs en tête de fichier)
js/main.js              Carrousel du hero, menu mobile, lien actif de la navigation
images/                 Photos et logos
```

## Animations

Pilotées par des attributs HTML, sans bibliothèque :

| Attribut | Effet |
|---|---|
| `data-reveal` | Apparition en fondu vers le haut quand l'élément entre à l'écran |
| `data-reveal="mask"` | Photo dévoilée de bas en haut |
| `data-reveal="ornament"` | Ornement qui se dessine depuis son losange central |
| `data-reveal="zoom"` / `"fade"` | Apparition par léger zoom / simple fondu |
| `data-parallax="0.06"` | Parallaxe : positif = premier plan, négatif = arrière-plan (`data-parallax-max` = décalage maximum en px, 60 par défaut) |
| `data-magnetic` | Bouton légèrement attiré par le curseur |

Les éléments qui apparaissent ensemble s'enchaînent automatiquement en cascade. Parallaxe et effets de curseur ne s'activent que sur grand écran avec souris ; tout est désactivé si le visiteur a demandé moins d'animations dans son système (`prefers-reduced-motion`).

## Voir le site en local

Ouvrir `index.html` directement dans un navigateur, ou lancer un petit serveur :

```bash
npx serve .
```

## Mise en ligne

Le dossier peut être déposé tel quel sur n'importe quel hébergement statique (OVH, o2switch, Netlify, Cloudflare Pages, GitHub Pages…).

## Charte

| Rôle            | Couleur   |
|-----------------|-----------|
| Vert forêt      | `#14231C` |
| Vert nuit       | `#0E1812` |
| Or              | `#C0A16E` |
| Rouge brique    | `#B5412B` |
| Crème           | `#F5F0E6` |
| Crème clair     | `#FBF8F2` |
| Texte           | `#231D17` |
| Texte secondaire| `#6A5F52` |

Polices : [Forum](https://fonts.google.com/specimen/Forum) (titres) et [DM Sans](https://fonts.google.com/specimen/DM+Sans) (texte), via Google Fonts.
