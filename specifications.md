# Monorail Cats 

## Pitch et règles.

Il s'agit d'une course sans fin entre 2 ou + joueurs (sur le même clavier), le dernier joueur en jeu est gagnant.
Un joueur contrôle un chat avec les touches du clavier.
Les chats sont sur un monorail possèdant divers embranchements permettant de selectionner une route.
Les chats récupèrennt un item aléatoirement dans des endroits définit de la map.
Les chats lancent les items pour vaincre leur adversaire.
Chaque chat a 9 vies.
Lorsqu'un chat meurt il retourne aléatoirement dans un des spawns.

V2

netcode pour jouer sur navigateurs interposés

## example de partie

Alice et Bob décident de régler leur comptes devant monorail cat. Alice est à gauche du clavier et bob de l'autre (par ce qu'il est super sympa). 
Bob lance monorail cat, l'opening se lance et propose choisir le nombre de joueurs. Bob survol 2 joueurs, 2 chats apparraissent avec les couleurs que prendront chaque joueurs. Et finit par cliquer. Le décompte démarre, la map apparait en arrière plan avec les chats à leurs points de spawn respectifs: Alice à gauche et bob à l'opposé. 
...


## Acteurs

### Keyboard
  * joueur 1 : 
    * q > gauche
    * d > droit
    * z > boost
    * space > item
  * joueur 2 :
    * touches directionnels
    * enter > item

V2

un twister ?


### Map

La map est constituée de tuiles définissant le circuit :

    * ligne droite
    * virage
    * embranchement en T
    * ...

Chaque tuile possède des propriétés autorisant le mouvement.

### Editeur de map

L'éditeur de map permet de positionner de manière graphique les tuiles et ainsi enregistrer la matrice de la map.

### Cats

Chats avec couleurs. (Bio chat et tout ça)

### Items

  * Mine : posé à un endroit de manière visible, n'importe quel chat explose s'il passe dessus.
  * Rainbow (cf. nyan) : speed up, le chat qui est poursuivit meurt s'il est percuté.
  * Pelote (missile) : tout droit, traverse les tuiles et explose n'importe quel chat qu'il rencontre.

V2

  * Souris : le chat suis obligatoirement la souris, le joueur ne controle plus les directions jusqu'à ce que son chat l'ait mangé. Il peut toujours utiliser les items.
  * huile empeche de tourner

### openning / ending

Opening : Présentation du jeu et des touches, choix du nombre de joueurs
Ending : Inscription du gagnant au tableaux des chats notoires, credits, rejouer (zapper l'opening)

## Propositions

  * Le chat ralentit si l'embranchement n'est pas correctement négocié : cad le joueur n'a pas appuyé au bon moment sur la touche ou alors sur une touche d'une direction impossible. le chat reprend sa vitesse de croisière sur 3 secondes.

  * Les évenements du jeu, utilisation d'items, coups portés aux autres joueurs sont présenté de manière textuelle aux joueurs de façon "arcade", stressante ou empechant la visibilitée.

  * Le gagnant d'une map obtient un point de notoriété de chat. Le top 10 des chats les plus notoires seront représentés sur le wall of fame des chats.


