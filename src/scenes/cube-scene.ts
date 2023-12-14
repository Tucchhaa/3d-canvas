import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight } from '../objects/light-source';
import { Object3D } from '../objects/object3d';
import { Vector3 } from '../structures/vector';

export class CubeScene extends Scene {
	#cube!: Object3D;
	#directLight1!: DirectLight;
	#directLight2!: DirectLight;
	#directLight3!: DirectLight;
	

	async prepareResources(): Promise<void> {
		await this.resourceLoader.loadObject('cube');
	}

	configureScene(): void {
		const camera = new Camera({ fov: 1.57 }, new Vector3(300, 300, -400));
		camera.rotate(Vector3.left, 0.3);
		camera.rotate(Vector3.down, 0.3);

		this.mainCamera = camera;

		// ===

		this.#directLight1 = new DirectLight({ direction: Vector3.forward, intensity: 0.4 });
		this.#directLight2 = new DirectLight({ direction: Vector3.down, intensity: 0.4 });
		this.#directLight3 = new DirectLight({ direction: Vector3.forward, intensity: 0.4 });

		this.lights.push(this.#directLight1);
		this.lights.push(this.#directLight2);
		this.lights.push(this.#directLight3);

		// ===

		this.#cube = this.createObject('cube', {
			name: 'cube',
			position: new Vector3(0, 0, 0),
			scale: new Vector3(100, 100, 100),
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).cube = this.#cube;

		this.#setDocumentEventListeners();
	}

	obBeforeUpdate(): void {
		this.#cube.rotate(Vector3.up, 0.005);
		this.#cube.rotate(Vector3.right, 0.003);
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
