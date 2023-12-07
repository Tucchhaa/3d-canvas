import { Camera } from '../objects/camera';
import { Object3D, Object3DConfig } from '../objects/object3d';
import { Vector3 } from '../structures/vector';
import { Renderer } from './renderer';
import { ResourceLoader } from './resource-loader';

type EngineEvents = 'onPrepare' | 'beforeLaunch' | 'beforeUpdate' | 'afterUpdate';

type EngineEventHandler = () => Promise<void> | void;

export class Engine {
	#renderer: Renderer;
	resourceLoader: ResourceLoader;

	#camera: Camera;

	#renderId: ReturnType<typeof setInterval> | undefined;

	#fps = 60;

	#objects: Object3D[] = [];

	private eventHandlers: { [key in EngineEvents]: EngineEventHandler[] } = {
		onPrepare: Array<EngineEventHandler>(),

		beforeLaunch: Array<EngineEventHandler>(),

		beforeUpdate: Array<EngineEventHandler>(),
		afterUpdate: Array<EngineEventHandler>(),
	};

	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		this.#renderer = new Renderer(canvas);
		this.resourceLoader = new ResourceLoader();

		this.#camera = camera;

		addEventListener('resize', () => {
			this.#renderer.updateDimensions();
		});
	}

	async launch() {
		await this.awaitedEmit('onPrepare');

		this.emit('beforeLaunch');

		this.#renderId = setInterval(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / this.#fps);
	}

	stop() {
		clearInterval(this.#renderId);
	}

	createObject(name: string, config: Partial<Object3DConfig>) {
		const geometry = this.resourceLoader.getObject(name);
		const defaultConfig: Object3DConfig = {
			geometry,
			pivot: Vector3.zero,
			position: Vector3.zero,
			scale: Vector3.one,
			direction: Vector3.forward
		};

		const object3d = new Object3D({ ...defaultConfig, ...config });

		this.#objects.push(object3d);

		return object3d;
	}

	getObject() {}

	update() {
		this.emit('beforeUpdate');

		this.#renderer.render(this.#camera, this.#objects);

		this.emit('afterUpdate');
	}

	on(eventName: EngineEvents, handler: EngineEventHandler) {
		this.eventHandlers[eventName].push(handler);
	}

	emit(eventName: EngineEvents) {
		for (const handler of this.eventHandlers[eventName]) {
			handler();
		}
	}

	async awaitedEmit(eventName: EngineEvents) {
		for (const handler of this.eventHandlers[eventName]) {
			await handler();
		}
	}
}
