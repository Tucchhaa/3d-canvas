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
1. If camera's direction is opposite to positive Z, then vertical rotation doesn't work properly
2. If all vertexes of polygon out of the screen, the triangle not rendered. In some cases this is wrong

### Functionality:
1. Lights
2. Shadow projections
3. Loading .obj models for rendering them
4. We need more advanced ZSort. Some times polygons are drawed in the wrong order.

### Refactoring: 
1. refactor rotation method
2. we should recognize if vertex is on the screen before projecting it (+optimization)
3. Use requestAnimationFrame instead of intervals

### Bonus functionality:
1. physics
2. multiplayer
