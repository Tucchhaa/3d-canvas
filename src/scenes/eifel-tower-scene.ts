import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight, SpotLight } from '../objects/light-source';
import { Object3D } from '../objects/object3d';
import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';

export class EifelTowerScene extends Scene {
	#tower!: Object3D;
	#directLight1!: DirectLight;
	#directLight2!: DirectLight;
	#spotLight1!: DirectLight;

	async prepareResources(): Promise<void> {
		await this.resourceLoader.loadObject('eifel-tower');
	}

	configureScene(): void {
		const camera = new Camera({ backgroundColor: new Color(4, 155, 229) }, new Vector3(70, 180, -500));
		// camera.rotate(Vector3.left, 0.3);
		// camera.rotate(Vector3.down, 0.3);

		this.mainCamera = camera;

		// ===

		this.#directLight1 = new DirectLight({ direction: Vector3.forward, intensity: 0.4 });
		this.#directLight2 = new DirectLight({ direction: Vector3.down, intensity: 0.4 });
		this.#spotLight1 = new SpotLight({ position: Vector3.up.multiply(-500), intensity: 0.6, radius: 1000 });

		this.lights.push(this.#directLight1);
		this.lights.push(this.#directLight2);
		this.lights.push(this.#spotLight1);

		// ===

		this.#tower = this.createObject('eifel-tower', {
			position: new Vector3(0, 0, 0),
			scale: new Vector3(0.01, 0.01, 0.01),
			color: new Color(131, 141, 158)
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).cube = this.#tower;

		this.#setDocumentEventListeners();
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
