# Snake

Web version of the classic Snake game based on Canvas with a few changes. User is able to select 5 different levels, which differ from each other in terms of difficulty. Each level is presented with a slightly different maze. When snake hits the maze wall or eats itself, the game is over. Snake can go through the board walls.

There are several powerups:
+ Slow down bonus
+ Speed up bonus
+ Extra points bonus
+ Shorten snake bonus
+ Enlarge snake bonus
+ Going through walls bonus

User is able to also set duration of boosters, game speed and number of parts of snake that is going to be deleted/added by powerups.

## Known bugs:
+ There can only be one bonus at a time and because of the reset of bonusAmount, it will be slowBonus as for the first modulus operation. If one types into console specific command (i.e. ``eatenFood = 17``), other bonus will show up (unless slowBonus is present).
+ LocalStorage does not render list item elements.