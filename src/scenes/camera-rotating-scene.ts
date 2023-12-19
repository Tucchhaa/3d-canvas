import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { Object3D } from '../objects/object3d';
import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';

const red = () => new Color(255, 0, 0);
const green = () => new Color(0, 255, 0);
const blue = () => new Color(0, 0, 255);

export class CameraRotatingScene extends Scene {
	angle = 0;
	objs: Object3D[] = [];

	configureScene(): void {
		const camera = (this.mainCamera = new Camera(
			{
				fov: Math.PI / 2,
			},
			new Vector3(0, 0, -800),
		));

		const DEFAULT_ANGLE = Math.PI / 2;
		const shuttle = (this.objs[0] = this.createObject('shuttle', {
			position: Vector3.zero,
			scale: new Vector3(20, 20, 20),
			color: new Color(0, 0, 255, 0.5),
			applyLights: false,
		}));
		shuttle.rotate(Vector3.left, Math.PI / 1.5);

		// X axis
		const xCube = (this.objs[1] = this.createObject('cube', {
			position: Vector3.zero,
			scale: new Vector3(50, 1, 1),
			color: red(),
			applyLights: false,
		}));
		xCube.rotate(Vector3.up, DEFAULT_ANGLE);
		const xPyramid = (this.objs[2] = this.createObject('pyramid', {
			position: new Vector3(-25, 0, 0),
			scale: new Vector3(5, 5, 5),
			color: red(),
			applyLights: false,
		}));
		xPyramid.rotate(Vector3.backward, Math.PI / 2);
		xPyramid.rotate(Vector3.up, DEFAULT_ANGLE, Vector3.zero);

		// Y axis
		const yCube = (this.objs[3] = this.createObject('cube', {
			position: Vector3.zero,
			scale: new Vector3(1, 50, 1),
			color: green(),
			applyLights: false,
		}));
		yCube.rotate(Vector3.up, DEFAULT_ANGLE);
		this.objs[4] = this.createObject('pyramid', {
			position: new Vector3(0, 25, 0),
			scale: new Vector3(5, 5, 5),
			color: green(),
			applyLights: false,
		});

		// Z axis
		const zCube = (this.objs[5] = this.createObject('cube', {
			position: Vector3.zero,
			scale: new Vector3(1, 1, 50),
			color: blue(),
			applyLights: false,
		}));
		zCube.rotate(Vector3.up, DEFAULT_ANGLE);
		const zPyramid = (this.objs[6] = this.createObject('pyramid', {
			position: new Vector3(0, 0, -25),
			scale: new Vector3(5, 5, 5),
			color: blue(),
			applyLights: false,
		}));
		zPyramid.rotate(Vector3.left, Math.PI / 2);
		zPyramid.rotate(Vector3.up, DEFAULT_ANGLE, Vector3.zero);

		// this.lights.push(new DirectLight({}));

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
	}

	onBeforeUpdate(): void {
		this.mainCamera.rotate(Vector3.up, 0.05);
		this.angle += 0.05;

		this.mainCamera.setPosition(new Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).multiply(-400));
	}

	async prepareResources(): Promise<void> {
		await Promise.all([
			this.resourceLoader.loadObject('shuttle'),
			this.resourceLoader.loadObject('cube'),
			this.resourceLoader.loadObject('pyramid'),
		]);
	}
}
