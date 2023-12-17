import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight, SpotLight } from '../objects/light-source';
import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';

const OBJ_NAMES = [
	'urban/low_building',
	'urban/low_wide',
	'urban/skyscraper',
	'urban/small_building',
	'urban/large_building',
];

const COLORS = [
	new Color(254, 215, 170), // orange
	new Color(45, 212, 191), // teal
	new Color(229, 231, 235), // grey
	new Color(92, 77, 69), // brown
	new Color(56, 189, 248), // light blue
];

export class UrbanScene extends Scene {
	configureScene(): void {
		const camera = (this.mainCamera = new Camera(
			{
				fov: Math.PI / 2,
			},
			new Vector3(-200, 100, 0),
		));
		camera.rotate(Vector3.up, 1.5);

		OBJ_NAMES.sort(() => Math.random() - 0.5).forEach((name, index) => {
			const x = 100 + index * 200;
			this.createObject(name, {
				position: new Vector3(x, 0, 200),
				scale: new Vector3(100, 100, 100),
				color: COLORS[Math.floor(Math.random() * OBJ_NAMES.length)],
			});
		});

		OBJ_NAMES.sort(() => Math.random() - 0.5).forEach((name, index) => {
			const x = 100 + index * 220;
			const obj = this.createObject(name, {
				position: new Vector3(x, 0, -200),
				scale: new Vector3(100, 100, 100),
				color: COLORS[Math.floor(Math.random() * OBJ_NAMES.length)],
			});
			// rotate the objects to face each other
			obj.rotate(Vector3.up, Math.PI);
		});

		this.lights.push(
			new DirectLight({
				direction: new Vector3(1, -1, 1).unit(),
				intensity: 0.3,
			}),
		);

		this.lights.push(
			new SpotLight({
				position: new Vector3(0, -100, 0),
				radius: 500,
				intensity: 0.9,
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
