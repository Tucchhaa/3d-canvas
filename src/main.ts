import { Engine } from './core/engine';
import { TestScene } from './scenes/test-scene';

const canvas = document.querySelector('canvas')!;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;

const engine = new Engine(canvas);

engine.setScene(TestScene);
engine.launch();
// setTimeout(() => { engine.stop(); }, 500);
