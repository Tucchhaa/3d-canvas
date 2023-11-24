# HTML Canvas 3D Engine

## Installation

1. download the repo
2. open terminal in the folder of the project
3. run `npm i`

## Development

1. run `npm run dev`
2. open `http://localhost:8080`
3. start developing :) page uses hot reload, so after any changes the page reloads automatically

## TO-DO

Refactoring: 
1. refactor rotation method
2. we should recognize if vertex is on the screen before projecting it (+optimization)

Bugs:
1. Rotation works incorrectly if object's position is not 0, 0, 0
2. If camera's direction is opposite to positive Z, then vertical rotation doesn't work properly

Functionality:
2. Lights
3. Shadow projections
4. Loading .obj models for rendering them

Bonus functionality:
1. physics
2. multiplayer
