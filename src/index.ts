import { Engine } from 'core/engine';
import { Camera } from 'objects/camera';
import { Cube, Pyramid } from 'objects/object3d';
import { Vector3 } from 'structures/vector';

// ===
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.offsetWidth * 2;
canvas.height = canvas.offsetHeight * 2;
canvas.getContext('2d')

const engine = new Engine(canvas);
const camera = new Camera({ fov: 1.57 }, new Vector3(0, 0, -600), new Vector3(0, 0, 1).unit());
(window as any).camera = camera;

engine.setCamera(camera);

// const cube = new Cube(new Vector3(0, 0, 0), new Vector3(30, 30, 30));

const cube1 = new Cube(new Vector3(-300, +50, 0), new Vector3(100, 100, 100));

const pyramid = new Pyramid(new Vector3(-550, 50, 0), new Vector3(50, 50, 50));

const pyramid1 = new Pyramid(new Vector3(0, 0, 0), new Vector3(50, 50, 50));

const cube2 = new Cube(new Vector3(-800, +50, 0), new Vector3(100, 100, 100));

const cube3 = new Cube(new Vector3(-550, -100, 0), new Vector3(600, 100, 100));

// cube.rotate(new Vector3(1, 1, 1).unit(), 1.4);

// engine.addObject(cube);
engine.addObject(pyramid1);

engine.addObject(cube1);
engine.addObject(pyramid);
engine.addObject(cube2);
engine.addObject(cube3);

engine.update();
console.log('========')
// camera.setDirection(new Vector3(0, 0.2, -1).unit());w
engine.update();

engine.on('beforeUpdate', () => {
    pyramid1.rotate(Vector3.right, 0.01);

    // cube2.scale = Vector3.multiply(cube2.scale, new Vector3(x, x, x));
});


engine.launch();
// setTimeout(() => { engine.stop(); }, 5000);


window.addEventListener('keypress', (e) => {
    const speed = 15;
    const rotSpeed = 0.03;
    let a =1;
    if(e.shiftKey) {
        if(e.key === 'W') {
            camera.rotate(Vector3.left, rotSpeed);
        }

        if(e.key === 'A')
            camera.rotate(Vector3.up, rotSpeed);

        if(e.key === 'S')
            camera.rotate(Vector3.right, rotSpeed);

        if(e.key === 'D')
            camera.rotate(Vector3.down, rotSpeed);

        return;
    }

    if(e.key === 'w')
        camera.translate(Vector3.forward.multiply(speed));

    if(e.key === 'a')
        camera.translate(Vector3.left.multiply(speed))

    if(e.key === 's')
        camera.translate(Vector3.backward.multiply(speed))

    if(e.key === 'd')
        camera.translate(Vector3.right.multiply(speed))

    if(e.key == 'z')
        camera.position.y -= speed;

    if(e.key == 'x')
        camera.position.y += speed;
});
