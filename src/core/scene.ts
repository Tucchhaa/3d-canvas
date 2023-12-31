import { Camera } from '../objects/camera';
import { LightSource } from '../objects/light-source';
import { Object3D, Object3DConfig } from '../objects/object3d';
import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';
import { Engine } from './engine';
import { ResourceLoader } from './resource-loader';

export abstract class Scene {
	protected engine: Engine;

	mainCamera!: Camera;

	protected resourceLoader: ResourceLoader;

	#objects: Object3D[] = [];

	lights: LightSource[] = [];

	constructor(engine: Engine) {
		this.engine = engine;
		this.resourceLoader = engine.resourceLoader;
	}

	abstract configureScene(): void;

	// ===

	createObject(name: string, config: Partial<Object3DConfig>) {
		const geometry = this.engine.resourceLoader.getObject(name);
		const defaultConfig: Object3DConfig = {
			geometry,
			color: new Color(0, 150, 255),
			backfaceCullingEnabled: true,
			layers: [],

			pivot: Vector3.zero,
			position: Vector3.zero,
			scale: Vector3.one,
			direction: Vector3.forward,
			applyLights: true,
		};

		const object3d = new Object3D({ ...defaultConfig, ...config });

		this.#objects.push(object3d);

		return object3d;
	}

	getObjects() {
		return this.#objects;
	}

	getObject() {}

	// ===
	// Events
	// ===
	async prepareResources() {}

	onBeforeUpdate() {}

	onAfterUpdate() {}
}
