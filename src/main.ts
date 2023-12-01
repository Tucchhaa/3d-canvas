/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Engine } from './core/engine';
import { Camera } from './objects/camera';
import { Vector3 } from './structures/vector';

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const camera = new Camera(
	{ fov: 1.57 },
	new Vector3(0, 0, -600),
	new Vector3(0, 0, 1).unit(),
);
const engine = new Engine(canvas, camera);

engine.on('onPrepare', async () => {
	await engine.resourceLoader.loadObject('cube');
	await engine.resourceLoader.loadObject('pyramid');
	await engine.resourceLoader.loadObject('teapot');
	await engine.resourceLoader.loadObject('shuttle');
});

let longCube: any;
let cube1: any;
let cube2: any;
let pyramid1: any;

engine.on('beforeLaunch', () => {
	longCube = engine.createObject('cube', {
		position: new Vector3(-250, -100, 0),
		scale: new Vector3(600, 100, 100),
	});

	cube1 = engine.createObject('cube', {
		position: new Vector3(0, +50, 0),
		scale: new Vector3(100, 100, 100),
	});
	cube2 = engine.createObject('cube', {
		position: new Vector3(-500, +50, 0),
		scale: new Vector3(100, 100, 100),
	});

	pyramid1 = engine.createObject('pyramid', {
		position: new Vector3(250, 0, 0),
		scale: Vector3.one.multiply(50),
	});

	engine.createObject('teapot', {
		position: new Vector3(500, 0, 0),
		scale: Vector3.one.multiply(100),
	});

	engine.createObject('shuttle', {
		position: new Vector3(0, 600, 0),
		scale: Vector3.one.multiply(50),
		direction: Vector3.right
	});
});

engine.on('beforeUpdate', () => {
	// pyramid1.rotate(Vector3.right, 0.05);
	// longCube.rotate(Vector3.up, 0.05);

	// cube1.rotate(new Vector3(1, 1, 1).unit(), 0.025);
	// cube2.rotate(new Vector3(-1, 1, 1).unit(), 0.025);
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
