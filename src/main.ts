/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Engine } from './core/engine';
import { Camera } from './objects/camera';
import { Object3D } from './objects/object3d';
import { Vector3 } from './structures/vector';

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const camera = new Camera({ fov: 1.57 }, new Vector3(0, 800, -1500));
camera.rotate(Vector3.left, 0.5);

const engine = new Engine(canvas, camera);

engine.on('onPrepare', async () => {
	await engine.resourceLoader.loadObject('cube');
	await engine.resourceLoader.loadObject('pyramid');
	await engine.resourceLoader.loadObject('teapot');
	await engine.resourceLoader.loadObject('shuttle');
});

let longCube: Object3D;
let cube1: Object3D;
let cube2: Object3D;
let pyramid1: Object3D;
let teaopot: Object3D;
let shuttle: Object3D;

engine.on('beforeLaunch', () => {
	longCube = engine.createObject('cube', {
		position: new Vector3(-250, -100, 0),
		scale: new Vector3(600, 100, 100),
	});

	cube1 = engine.createObject('cube', {
		name: 'cube',
		pivot: new Vector3(50, -50, 50),
		position: new Vector3(-150, 125, -50),
		scale: new Vector3(100, 100, 100),
	});
	
	cube2 = engine.createObject('cube', {
		position: new Vector3(-500, +50, 0),
		scale: new Vector3(100, 100, 100),
	});

	pyramid1 = engine.createObject('pyramid', {
		position: new Vector3(-100, 50, 0),
		scale: Vector3.one.multiply(50),
	});

	teaopot = engine.createObject('teapot', {
		position: new Vector3(500, 0, 0),
		scale: Vector3.one.multiply(100),
	});

	shuttle = engine.createObject('shuttle', {
		position: new Vector3(0, 0, 1200),
		scale: Vector3.one.multiply(50),
		direction: Vector3.right,
	});

	shuttle.rotate(Vector3.left, Math.PI/2+0.7);
});

engine.on('beforeUpdate', () => {
	cube1.rotate(Vector3.up, 0.025);
	shuttle.rotate(Vector3.up, 0.025, new Vector3(0, 0, 0));
});

engine.launch();
// setTimeout(() => { engine.stop(); }, 500);

addEventListener('keydown', (e) => {
	const speed = 30;
	const rotSpeed = 0.07;

	if (e.shiftKey) {
		if (e.key === 'W') camera.rotate(Vector3.right, rotSpeed);

		if (e.key === 'A') camera.rotate(Vector3.up, rotSpeed);

		if (e.key === 'S') camera.rotate(Vector3.left, rotSpeed);

		if (e.key === 'D') camera.rotate(Vector3.down, rotSpeed);

		return;
	}

	if (e.key === 'w') camera.setPosition(Vector3.add(camera.position, Vector3.forward.multiply(speed)));

	if (e.key === 'a') camera.setPosition(Vector3.add(camera.position, Vector3.left.multiply(speed)));

	if (e.key === 's') camera.setPosition(Vector3.add(camera.position, Vector3.backward.multiply(speed)));

	if (e.key === 'd') camera.setPosition(Vector3.add(camera.position, Vector3.right.multiply(speed)));

	if (e.key == 'z') camera.position.y -= speed;

	if (e.key == 'x') camera.position.y += speed;
});
