import { Camera } from "objects/camera";
import { Object3D } from "objects/object3d";
import { Renderer } from "./renderer";

type EngineEvents = 'beforeUpdate' | 'afterUpdate'; 

type EngineEventHandler = () => void;

export class Engine {
    private readonly renderer: Renderer;

    private renderInterval: number = -1;

    private FPS = 24;

    private readonly objects: Object3D[] = [];

    private mainCamera!: Camera;

    private eventHandlers: { [key in EngineEvents]: EngineEventHandler[] } = {
        beforeUpdate: Array<EngineEventHandler>(),
        afterUpdate: Array<EngineEventHandler>()
    };

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);

        window.addEventListener('resize', () => {
            this.renderer.updateDimensions();
        });
    }

    // ===

    public setCamera(camera: Camera) {
        this.mainCamera = camera;
    }

    public launch() {
        this.renderInterval = setInterval(this.update.bind(this), 1000 / this.FPS);
    }

    public stop() {
        clearInterval(this.renderInterval);
    }


    public addObject(object3d: Object3D) {
        this.objects.push(object3d);
    }

    update() {
        this.emit('beforeUpdate');

        this.renderer.render(this.mainCamera, this.objects);

        this.emit('afterUpdate');
    }

    // ===
    // Events
    // ===
    on(eventName: EngineEvents, handler: EngineEventHandler) {
        this.eventHandlers[eventName].push(handler);
    }

    emit(eventName: EngineEvents) {
        for(const handler of this.eventHandlers[eventName]) {
            handler();
        }
    }
}
