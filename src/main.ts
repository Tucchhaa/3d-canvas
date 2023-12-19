/* eslint-disable @typescript-eslint/no-unused-vars */
import { Engine } from './core/engine';
import { AxisScene } from './scenes/axis-scene';
import { CameraRotatingScene } from './scenes/camera-rotating-scene';
import { CombinedDirectLightScene } from './scenes/combined-direct-light-scene';
import { CubeScene } from './scenes/cube-scene';
import { DirectLightScene } from './scenes/direct-light-scene';
import { PointLightScene } from './scenes/point-light-scene';
import { RotatingScene } from './scenes/rotating-scene';
import { ScaleScene } from './scenes/scale-scene';
import { SolarScene } from './scenes/solar-scene';
import { TestScene } from './scenes/test-scene';
import { TranslationScene } from './scenes/translation-scene';
import { UrbanScene } from './scenes/urban-scene';

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const engine = new Engine(canvas);

(async () => {
	// await engine.setScene(AxisScene);
	// await engine.setScene(RotatingScene);
	// await engine.setScene(CameraRotatingScene);
	// await engine.setScene(ScaleScene);
	// await engine.setScene(TranslationScene);
	await engine.setScene(UrbanScene);
	// await engine.setScene(SolarScene);
	// await engine.setScene(TestScene);
	// await engine.setScene(CubeScene);
	// await engine.setScene(DirectLightScene);
	// await engine.setScene(CombinedDirectLightScene);
	// await engine.setScene(PointLightScene);

	engine.launch();
	// engine.drawFrame();
})();

// setTimeout(() => { engine.stop(); }, 500);
