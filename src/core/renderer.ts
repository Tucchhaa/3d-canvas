import Matrix from "structures/matrix";
import { Object3D } from "objects/object3d";
import { Polygon } from "structures/polygon";
import { Vector3, Vector2 } from "structures/vector";
import { Camera } from "objects/camera";

export class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    // ===
    // Screen dimensions
    // ===
    private width!: number;
    private height!: number;
    private ratio!: number;

    private offset_x!: number;
    private offset_y!: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        this.updateDimensions();
    }

    public updateDimensions() {
        const { canvas } = this;

        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;

        this.width = canvas.width;
        this.height = canvas.height;
        this.ratio = this.width / this.height;

        this.offset_x = canvas.width / 2;
        this.offset_y = canvas.height / 2;

        // ctx styles
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
    }

    public render(camera: Camera, objects: Object3D[]) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(const object3d of objects) {
            for(const polygon of object3d.polygons) {
                this.drawPolygon(camera, polygon);
            }
        }
    }

    private drawPolygon(camera: Camera, polygon: Polygon) {
        const { ctx } = this;

        const points = this.getPointsOnScreen(camera, polygon);

        if(points === undefined) {
            return;
        }

        const startPoint = points[0];

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);

        for(let i=1; i < points.length; i++) {
            const point = points[i];
            ctx.lineTo(point.x, point.y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * 
     * @returns array of points on the screen or undefined if points are out of the screen.
     */
    private getPointsOnScreen(camera: Camera, polygon: Polygon): Vector2[] | undefined {
        const points = polygon.vertexes.map(vertex => camera.project(vertex));

        // TODO: need a function for checking if triangle is on the screen. Without this culling, optimization will be bad
        // if(points.every(point => !camera.isProjectedPointInViewport(point)))
        //     return undefined;

        return points.map(point => 
            point
                .asVector2()
                .multiply(new Vector2(this.offset_x, this.offset_y * this.ratio))
                .add(new Vector2(this.offset_x, this.offset_y))
        );
    }
}
