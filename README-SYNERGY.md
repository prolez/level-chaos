# Level Chaos - Système de Synergie

Un système de cartes modificateurs pour transformer Level Devil en expérience roguelite avec des synergies dynamiques.

## Concept

Level Chaos (ou Synergy Trap) ajoute un système de cartes au jeu Level Devil, créant une boucle de gameplay roguelite où :
- Le joueur obtient des cartes après chaque niveau réussi
- Les cartes modifient à la fois le joueur et le niveau/pièges
- Les cartes interagissent pour créer des synergies uniques
- La mort fait perdre la carte la plus récente

## Types de Cartes

### 🎨 Cartes de Niveau (Pièges)
Modifient les éléments du niveau et des pièges :
- **Glissement** : Le sol est de la glace
- **Ombre** : Les ennemis sont invisibles jusqu'à proximité
- **Inversion** : Le texte des indices est inversé
- **Invisible** : Certains blocs sont des trous cachés
- **Anti-Gravité** : Saut plus lent
- **Interrupteurs** : Les blocs changent d'état à chaque saut
- **Inversion de Symbole** : La porte de sortie est la porte de la mort

### 🛡️ Cartes de Joueur (Capacités)
Modifient les capacités du personnage :
- **Double Saut** : Permet de sauter deux fois
- **Sprint Fantôme** : Traverse brièvement les pièges
- **Vue Perceptive** : Révèle les pièges invisibles
- **Marqueur de Pression** : Génère des étincelles en marchant
- **Contrôle Mental** : Ralentit le temps en l'air
- **Saut Léger** : Saut à peine audible/visible
- **Sixième Sens** : La sortie réelle émet un signal sonore
- **Le Titan** : +50% vitesse et saut, mais sol explosif
- **Vitesse Accrue** : Augmente la vitesse (cumulable)

## Synergies

Les cartes interagissent pour créer des effets uniques :

### ⚡ Lévitation Mentale
- **Cartes** : Anti-Gravité + Contrôle Mental
- **Effet** : Permet de voler à basse altitude

### ⚡ Piège Réactif
- **Cartes** : Interrupteurs + Saut Léger
- **Effet** : Le saut léger annule l'effet des interrupteurs

### ⚡ Les Faux Amis
- **Cartes** : Inversion de Symbole + Sixième Sens
- **Effet** : Le sixième sens ignore l'inversion de symbole

### ⚡ Révélation par Pression
- **Cartes** : Invisible + Marqueur de Pression
- **Effet** : Les marqueurs révèlent les trous invisibles

## Raretés

- **Commun** (Gris) : Cartes de base, fréquentes
- **Peu Commun** (Vert) : Cartes utiles, modérément rares
- **Rare** (Bleu) : Cartes puissantes
- **Épique** (Violet) : Cartes très puissantes avec risques
- **Légendaire** (Orange) : Cartes transformatives

## Contrôles

### Contrôles du Jeu
- **Touches directionnelles** : Déplacement
- **Espace** : Saut
- **R** : Recommencer le niveau

### Contrôles Debug
- **Ctrl+L** : Simuler fin de niveau
- **Ctrl+D** : Simuler mort du joueur
- **Ctrl+S** : Afficher sélection de cartes
- **Boutons Debug** : En bas à gauche de l'écran

## Interface

### Cartes Actives (Haut Droite)
Affiche toutes les cartes actuellement actives avec :
- Nom de la carte
- Description
- Couleur selon la rareté

### Statistiques (Haut Gauche)
- Run actuel
- Niveau actuel
- Nombre de morts

### Sélection de Cartes
Après chaque niveau, choisissez parmi 3 cartes aléatoires :
- Cliquez sur une carte pour la sélectionner
- Survolez pour voir l'effet de zoom
- Les synergies sont détectées automatiquement

## Persistence

Le système sauvegarde automatiquement :
- Inventaire de cartes actives
- Statistiques de la run
- Cartes de base

Utilisez le bouton "Reset" pour réinitialiser complètement.

## Architecture Technique

### Fichiers
- `synergy-system.js` : Système principal (cartes, inventaire, effets, UI)
- `game-integration.js` : Intégration avec Level Devil
- `index.html` : Point d'entrée modifié

### Classes Principales
- **SynergySystem** : Orchestrateur principal
- **CardDatabase** : Base de données des cartes
- **CardInventory** : Gestion de l'inventaire
- **EffectManager** : Gestion des effets et synergies
- **GameState** : État de la run
- **SynergyUI** : Interface utilisateur
- **GameIntegration** : Hooks dans le jeu

## Développement Futur

### Fonctionnalités Planifiées
- [ ] Implémentation réelle des effets de cartes
- [ ] Détection automatique de fin de niveau
- [ ] Détection automatique de mort
- [ ] Boutique de cartes avec monnaie
- [ ] Statistiques avancées
- [ ] Succès/achievements
- [ ] Modes de difficulté
- [ ] Plus de cartes et synergies
- [ ] Effets visuels avancés
- [ ] Sons pour les synergies

### Extensions Possibles
- Cartes empilables avec effets multiplicateurs
- Cartes avec risques/récompenses
- Méta-progression entre les runs
- Déblocage de cartes
- Boss avec mécaniques de cartes

## Contribution

Pour ajouter de nouvelles cartes :
1. Ajoutez la carte dans `CardDatabase.initializeCards()`
2. Implémentez l'effet dans `GameIntegration.applyEffect()`
3. Ajoutez les synergies dans `EffectManager.initializeSynergies()`

## Licence

Ce système est une extension du jeu Level Devil existant.
