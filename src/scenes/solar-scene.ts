import { Scene } from '../core/scene';
import { Camera } from '../objects/camera';
import { DirectLight, SpotLight } from '../objects/light-source';
import { Object3D } from '../objects/object3d';
import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';

const OBJ_NAMES = [
	'solar/sun',
	'solar/mercury',
	'solar/venus',
	'solar/earth',
	'solar/mars',
	'solar/jupiter',
	'solar/saturn',
	'solar/uranus',
	'solar/neptune',
] as const;

export class SolarScene extends Scene {
	sun?: Object3D;
	mercury?: Object3D;
	venus?: Object3D;
	earth?: Object3D;
	mars?: Object3D;
	jupiter?: Object3D;
	saturn?: Object3D;
	uranus?: Object3D;
	neptune?: Object3D;
	moon?: Object3D;

	configureScene(): void {
		const camera = (this.mainCamera = new Camera({ backgroundColor: new Color(30, 39, 46) }, new Vector3(0, 300, -1300)));

		// rgb(30, 39, 46)
		camera.rotate(Vector3.left, 0.4);

		this.sun = this.createObject(OBJ_NAMES[0], {
			position: Vector3.zero,
			scale: new Vector3(50, 50, 50),
			color: new Color(253, 224, 71),
			layers: ['sun'],
		});

		this.mercury = this.createObject(OBJ_NAMES[1], {
			position: new Vector3(0, 0, 250),
			scale: new Vector3(150, 150, 150),
			color: new Color(177, 173, 173),
		});

		this.venus = this.createObject(OBJ_NAMES[2], {
			position: new Vector3(350, 0, 0),
			scale: new Vector3(150, 150, 150),
			color: new Color(249, 194, 26),
		});

		this.earth = this.createObject(OBJ_NAMES[3], {
			position: new Vector3(0, -20, 450),
			scale: new Vector3(0.05, 0.05, 0.05),
			color: new Color(79, 76, 176),
		});

		this.moon = this.createObject(OBJ_NAMES[3], {
			position: new Vector3(0, -10, 480),
			scale: new Vector3(0.02, 0.02, 0.02),
			color: new Color(223, 230, 233),
		});

		this.mars = this.createObject(OBJ_NAMES[4], {
			position: new Vector3(0, 0, 600),
			scale: new Vector3(1e-4, 1e-4, 1e-4),
			color: new Color(193, 68, 14),
		});

		this.jupiter = this.createObject(OBJ_NAMES[5], {
			position: new Vector3(0, -23, -750),
			scale: new Vector3(0.7, 0.7, 0.7),
			color: new Color(201, 144, 57),
		});

		this.saturn = this.createObject(OBJ_NAMES[6], {
			position: new Vector3(0, 0, -900),
			scale: new Vector3(0.1, 0.1, 0.1),
			color: new Color(234, 214, 184),
		});

		this.uranus = this.createObject(OBJ_NAMES[7], {
			position: new Vector3(0, 0, -1000),
			scale: new Vector3(50, 50, 50),
			color: new Color(209, 231, 231),
		});

		this.neptune = this.createObject(OBJ_NAMES[8], {
			position: new Vector3(0, 0, -1300),
			scale: new Vector3(1e-4, 1e-4, 1e-4),
			color: new Color(63, 84, 186),
		});

		this.lights.push(new SpotLight({ position: Vector3.zero, radius: 5000, intensity: 1.2 }));
		this.lights.push(new DirectLight({ direction: new Vector3(1, -2, 1).unit(), intensity: 0.3 }));
		this.lights.push(new DirectLight({ direction: new Vector3(-1, -2, 1).unit(), intensity: 0.3 }));
		// light for the sun
		const sunLightsIntensity = 0.35;

		this.lights.push(new DirectLight({ direction: Vector3.forward, intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: Vector3.backward, intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: Vector3.left, intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: Vector3.right, intensity: sunLightsIntensity, layers: ['sun'] }));

		this.lights.push(new DirectLight({ direction: new Vector3(1, 0, 1).unit(), intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: new Vector3(1, 0, -1).unit(), intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: new Vector3(-1, 0, -1).unit(), intensity: sunLightsIntensity, layers: ['sun'] }));
		this.lights.push(new DirectLight({ direction: new Vector3(-1, 0, 1).unit(), intensity: sunLightsIntensity, layers: ['sun'] }));

		this.lights.push(new DirectLight({ direction: Vector3.up, intensity: sunLightsIntensity + 0.1, layers: ['sun'] }));

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
		const speed = 0.005;
		const earthRotatingSpeed = 0.8;

		this.sun?.rotate(Vector3.up, 1 * speed);

		this.mercury?.rotate(Vector3.down, 1.1 * speed, Vector3.zero);

		this.venus?.rotate(Vector3.up, 1.2 * speed, Vector3.zero);

		this.earth?.rotate(Vector3.down, earthRotatingSpeed * speed, Vector3.zero);
		this.earth?.rotate(Vector3.down, 1.3 * speed);

		this.mars?.rotate(Vector3.down, 1.4 * speed, Vector3.zero);
		this.mars?.rotate(Vector3.down, 0.4 * speed);

		this.jupiter?.rotate(Vector3.down, 1.7 * speed, Vector3.zero);
		this.jupiter?.rotate(Vector3.down, 0.7 * speed);

		this.saturn?.rotate(Vector3.down, 0.4 * speed, Vector3.zero);
		this.saturn?.rotate(Vector3.down, 0.6 * speed);

		this.uranus?.rotate(Vector3.up, 1.3 * speed, Vector3.zero);

		this.neptune?.rotate(Vector3.down, 1 * speed, Vector3.zero);

		// this.moon?.setPosition(Vector3.add(this.earth!.position, new Vector3(0, 0, 50)));
		this.moon?.rotate(Vector3.down, earthRotatingSpeed * speed, Vector3.zero);
		this.moon?.rotate(Vector3.down, 8 * speed, this.earth?.position);
	}

	async prepareResources(): Promise<void> {
		await Promise.all(OBJ_NAMES.map((o) => this.resourceLoader.loadObject(o)));
	}
}
