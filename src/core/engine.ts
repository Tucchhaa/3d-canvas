import { Camera } from '../objects/camera';
import { Object3D } from '../objects/object3d';
import { Renderer } from './renderer';

type EngineEvents = 'beforeUpdate' | 'afterUpdate';

type EngineEventHandler = () => void;

export class Engine {
	#renderer: Renderer;
	#camera: Camera;

	#renderId: ReturnType<typeof setInterval> | undefined;

	#fps = 60;

	#objects: Object3D[] = [];

	private eventHandlers: { [key in EngineEvents]: EngineEventHandler[] } = {
		beforeUpdate: Array<EngineEventHandler>(),
		afterUpdate: Array<EngineEventHandler>(),
	};

	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		this.#renderer = new Renderer(canvas);
		this.#camera = camera;

		addEventListener('resize', () => {
			this.#renderer.updateDimensions();
		});
	}

	launch() {
		this.#renderId = setInterval(this.update.bind(this), 1000 / this.#fps);
	}

	stop() {
		clearInterval(this.#renderId);
	}

	addObject(object: Object3D) {
		this.#objects.push(object);
		return this;
	}

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
}
