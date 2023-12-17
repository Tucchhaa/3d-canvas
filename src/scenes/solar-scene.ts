import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight } from '../objects/light-source';
import { Vector3 } from '../structures/vector';

export class SolarScene extends Scene {
	configureScene(): void {
		const camera = (this.mainCamera = new Camera(
			{
				fov: Math.PI / 2,
			},
			new Vector3(0, 100, 0),
		));

		const solar = this.createObject('solar/solar_2', {
			position: new Vector3(0, 0, 800),
			scale: new Vector3(100, 100, 100),
		});
		solar.rotate(Vector3.up, -Math.PI / 2);

		this.lights.push(new DirectLight({}));

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
		await Promise.all([this.resourceLoader.loadObject('solar/solar_1'), this.resourceLoader.loadObject('solar/solar_2')]);
	}
}
