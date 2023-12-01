# HTML Canvas 3D Engine

## Installation

1. download the repo
2. open terminal in the folder of the project
3. run `npm i`

## Development

1. run `npm run dev`
2. open `http://localhost:5173`
3. start developing :) page uses hot reload, so after any changes the page reloads automatically

## Keyboard

1. `WASD` to move camera
2. `Shift + WASD` to rotate camera in correspoding direction
3. `Z` - move down, `X` - move up

## TO-DO

### Bugs:

1. If camera's direction is opposite to positive Z, then vertical rotation doesn't work properly
2. We need more advanced ZSort. Some times polygons are drawed in the wrong order.

### Functionality:

1. Lights
2. Shadow projections
3. Need to add more complex 3D-objects

### Refactoring:

1. refactor rotation method
2. Need more optimization, renderering a lot of polygons causes lugs
3. we should recognize if vertex is on the screen before projecting it (+optimization)
4. Use requestAnimationFrame instead of intervals

### Bonus functionality:

1. physics
2. multiplayer
