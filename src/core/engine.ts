import { Renderer } from './renderer';
import { ResourceLoader } from './resource-loader';
import { Scene } from './scene';

export class Engine {
	#renderer: Renderer;
	resourceLoader: ResourceLoader;

	#renderId: ReturnType<typeof setInterval> | undefined;

	#fps = 60;

	#scene!: Scene;

	constructor(canvas: HTMLCanvasElement) {
		this.#renderer = new Renderer(canvas);
		this.resourceLoader = new ResourceLoader();

		addEventListener('resize', () => {
			this.#renderer.updateDimensions();
		});
	}

	async launch() {
		await this.#scene.onPrepareResources();

		this.#scene.onBeforeLaunch();

		this.#renderId = setInterval(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / this.#fps);
	}

	stop() {
		clearInterval(this.#renderId);
	}


	update() {
		this.#scene.obBeforeUpdate();

		this.#renderer.render(this.#scene);

		this.#scene.onAfterUpdate();
	}

	setScene(sceneContructor: new (engine: Engine) => Scene) {
		this.stop();

		const scene = new sceneContructor(this);

		scene.configureScene();

		this.#scene = scene;
	}
}
