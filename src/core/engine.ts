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
		this.#renderId = setInterval(() => {
			requestAnimationFrame(this.update.bind(this));
		}, 1000 / this.#fps);
	}

	drawFrame() {
		requestAnimationFrame(this.update.bind(this));
	}

	stop() {
		clearInterval(this.#renderId);
	}

	update() {
		this.#scene.onBeforeUpdate();

		this.#renderer.render(this.#scene);

		this.#scene.onAfterUpdate();
	}

	async setScene(sceneContructor: new (engine: Engine) => Scene) {
		this.stop();

		const scene = new sceneContructor(this);

		this.#scene = scene;

		await this.#scene.prepareResources();

		this.#scene.configureScene();
	}
}
