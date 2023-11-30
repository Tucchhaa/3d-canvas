import { Matrix } from 'ml-matrix';

import { Engine } from './core/engine';
import { Camera } from './objects/camera';
import { Cube, Pyramid } from './objects/object3d';
import { Vector3 } from './structures/vector';

declare module 'ml-matrix' {
	export interface Matrix {
		asHomogeneous(): Matrix;
	}
}

Matrix.prototype.asHomogeneous = function (this: Matrix) {
	const matrix = new Matrix(this);

	if (matrix.isRowVector()) {
		return matrix.addColumn(matrix.columns, [1]);
	}

	if (matrix.isColumnVector()) {
		return matrix.addRow(matrix.rows, [1]);
	}

	const column = Array(matrix.rows).fill(0);
	const row = Array(matrix.columns + 1).fill(0);

	row[matrix.columns] = 1;

	return matrix.addColumn(matrix.columns, column).addRow(matrix.rows, row);
};

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const camera = new Camera(
	{ fov: 1.57 },
	new Vector3(0, 0, -600),
	new Vector3(0, 0, 1).unit(),
);
const engine = new Engine(canvas, camera);
// const camera = new Camera({ fov: 1.57 }, new Vector3(0, 0, 600), new Vector3(0, 0, -1).unit());
// const camera = new Camera({ fov: 1.57 }, new Vector3(-251, 0, 0), new Vector3(1, 0, 0).unit());

// const cube = new Cube(new Vector3(0, 0, 0), new Vector3(30, 30, 30));

const cube1 = new Cube(new Vector3(-300, +50, 0), new Vector3(100, 100, 100));

const pyramid = new Pyramid(new Vector3(-550, 50, 0), new Vector3(50, 50, 50));

const pyramid1 = new Pyramid(new Vector3(50, 50, 0), new Vector3(50, 50, 50));

const cube2 = new Cube(new Vector3(-800, +50, 0), new Vector3(100, 100, 100));

const longCube = new Cube(
	new Vector3(-550, -100, 0),
	new Vector3(600, 100, 100),
);

// cube.rotate(new Vector3(1, 1, 1).unit(), 1.4);

// engine.addObject(cube);
engine
	.addObject(pyramid1)
	.addObject(cube1)
	.addObject(pyramid)
	.addObject(cube2)
	.addObject(longCube)
	.update();

// camera.setDirection(new Vector3(0, 0.2, -1).unit());
// camera.setPosition(new Vector3(-249, 0, 0));

pyramid1.rotate(Vector3.right, 0.05);

engine.on('beforeUpdate', () => {
	pyramid1.rotate(Vector3.right, 0.05);
	longCube.rotate(Vector3.up, 0.05);

	// cube2.scale = Vector3.multiply(cube2.scale, new Vector3(x, x, x));
});

engine.launch();
// setTimeout(() => { engine.stop(); }, 5000);

addEventListener('keydown', (e) => {
	const speed = 30;
	const rotSpeed = 0.07;

	if (e.shiftKey) {
		if (e.key === 'W') {
			camera.rotate(Vector3.left, rotSpeed);
		}

		if (e.key === 'A') camera.rotate(Vector3.up, rotSpeed);

		if (e.key === 'S') camera.rotate(Vector3.right, rotSpeed);

		if (e.key === 'D') camera.rotate(Vector3.down, rotSpeed);

		return;
	}

	if (e.key === 'w') camera.translate(Vector3.forward.multiply(speed));

	if (e.key === 'a') camera.translate(Vector3.left.multiply(speed));

	if (e.key === 's') camera.translate(Vector3.backward.multiply(speed));

	if (e.key === 'd') camera.translate(Vector3.right.multiply(speed));

	if (e.key == 'z') camera.position.y -= speed;

	if (e.key == 'x') camera.position.y += speed;
});
