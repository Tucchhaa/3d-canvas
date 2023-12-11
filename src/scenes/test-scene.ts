import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight } from '../objects/light-source';
import { Object3D } from '../objects/object3d';
import { Vector3 } from '../structures/vector';

export class TestScene extends Scene {
	#longCube!: Object3D;
	#cube1!: Object3D;
	#cube2!: Object3D;
	#pyramid1!: Object3D;
	#teapot!: Object3D;
	#shuttle!: Object3D;
	#directLight1!: DirectLight;
	#directLight2!: DirectLight;

	async prepareResources(): Promise<void> {
		await Promise.all([
			this.resourceLoader.loadObject('cube'),
			this.resourceLoader.loadObject('pyramid'),
			this.resourceLoader.loadObject('teapot'),
			this.resourceLoader.loadObject('shuttle'),
		]);
	}

	configureScene(): void {
		const camera = new Camera({ fov: 1.57 }, new Vector3(0, 800, -1500));
		camera.rotate(Vector3.left, 0.5);

		this.mainCamera = camera;

		// ===

		this.#directLight1 = new DirectLight({ direction: Vector3.forward, intensity: 0.9 });
		this.#directLight2 = new DirectLight({ direction: Vector3.down, intensity: 0.4 });

		this.lights.push(this.#directLight1);
		this.lights.push(this.#directLight2);

		// ===

		this.#longCube = this.createObject('cube', {
			position: new Vector3(-250, -100, 0),
			scale: new Vector3(600, 100, 100),
		});

		this.#cube1 = this.createObject('cube', {
			name: 'cube',
			pivot: new Vector3(50, -50, 50),
			position: new Vector3(-150, 125, -50),
			scale: new Vector3(100, 100, 100),
		});

		this.#cube2 = this.createObject('cube', {
			position: new Vector3(-500, +50, 0),
			scale: new Vector3(100, 100, 100),
		});

		this.#pyramid1 = this.createObject('pyramid', {
			position: new Vector3(-100, 50, 0),
			scale: Vector3.one.multiply(50),
		});

		this.#teapot = this.createObject('teapot', {
			position: new Vector3(500, 0, 0),
			scale: Vector3.one.multiply(100),
		});

		this.#shuttle = this.createObject('shuttle', {
			position: new Vector3(0, 0, 1200),
			scale: Vector3.one.multiply(50),
		});

		this.#shuttle.rotate(Vector3.left, Math.PI / 2 + 0.7);

		this.#setDocumentEventListeners();
	}

	onBeforeUpdate(): void {
		this.#cube1.rotate(Vector3.up, 0.025);
		this.#shuttle.rotate(Vector3.up, 0.025, new Vector3(0, 0, 0));
	}

	// ===

	#setDocumentEventListeners() {
		const camera = this.mainCamera;

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
}
