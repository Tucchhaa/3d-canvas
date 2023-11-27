# HTML Canvas 3D Engine

## Installation

1. download the repo
2. open terminal in the folder of the project
3. run `npm i`

## Development

1. run `npm run dev`
2. open `http://localhost:8080`
3. start developing :) page uses hot reload, so after any changes the page reloads automatically

## Keyboard

1. `WASD` to move camera
2. `Shift + WASD` to rotate camera in correspoding direction
3. `Z` - move down, `X` - move up

## TO-DO

### Bugs:
1. Rotation works incorrectly if object's position is not 0, 0, 0
2. If camera's direction is opposite to positive Z, then vertical rotation doesn't work properly
3. If all vertexes of polygon out of the screen, the triangle not rendered. In some cases this is wrong

### Functionality:
1. Lights
2. Shadow projections
3. Loading .obj models for rendering them

### Refactoring: 
1. refactor rotation method
2. we should recognize if vertex is on the screen before projecting it (+optimization)

### Bonus functionality:
1. physics
2. multiplayer
