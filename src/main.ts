/* eslint-disable @typescript-eslint/no-unused-vars */
import { Engine } from './core/engine';
import { CubeScene } from './scenes/cube-scene';
import { SolarScene } from './scenes/solar-scene';
import { TestScene } from './scenes/test-scene';
import { UrbanScene } from './scenes/urban-scene';

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const engine = new Engine(canvas);

(async () => {
	// await engine.setScene(TestScene);
	// await engine.setScene(CubeScene);
	await engine.setScene(UrbanScene);
	// await engine.setScene(SolarScene);

	engine.launch();
	// engine.drawFrame();
})();

// setTimeout(() => { engine.stop(); }, 500);
