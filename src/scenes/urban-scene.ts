import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight } from '../objects/light-source';
import { Vector3 } from '../structures/vector';

const OBJ_NAMES = ['urban/large_building', 'urban/low_building', 'urban/low_wide', 'urban/skyscraper', 'urban/small_building'];

export class UrbanScene extends Scene {
	configureScene(): void {
		const camera = (this.mainCamera = new Camera(
			{
				fov: Math.PI / 2,
			},
			new Vector3(0, 100, 0),
		));
		camera.rotate(Vector3.up, 1.5);

		OBJ_NAMES.forEach((name, index) => {
			const x = 100 + index * 200;
			this.createObject(name, {
				position: new Vector3(x, 0, 200),
				scale: new Vector3(100, 100, 100),
			});
		});

		OBJ_NAMES.sort(() => Math.random()).forEach((name, index) => {
			const x = 100 + index * 150;
			const obj = this.createObject(name, {
				position: new Vector3(x, 0, -200),
				scale: new Vector3(100, 100, 100),
			});
			// rotate the objects to face each other
			obj.rotate(Vector3.up, Math.PI);
		});

		// TODO adjust lighting
		this.lights.push(
			new DirectLight({
				direction: Vector3.left,
			}),
		);
		this.lights.push(
			new DirectLight({
				direction: Vector3.right,
			}),
		);

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

	async prepareResources(): Promise<void> {
		await Promise.all(OBJ_NAMES.map((o) => this.resourceLoader.loadObject(o)));
	}
}
