import { Camera } from '../objects/camera';
import { Object3D } from '../objects/object3d';
import { Polygon } from '../structures/polygon';
import { Vector2 as Vector2D } from '../structures/vector';

export class Renderer {
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	// ===
	// Screen dimensions
	// ===
	#width!: number;
	#height!: number;
	#ratio!: number;

	#offsetX!: number;
	#offsetY!: number;

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
		this.#ctx = canvas.getContext('2d')!;

		this.updateDimensions();
	}

	updateDimensions() {
		this.#canvas.width = this.#width = this.#canvas.offsetWidth * 2;
		this.#canvas.height = this.#height = this.#canvas.offsetHeight * 2;

		this.#ratio = this.#width / this.#height;

		this.#offsetX = this.#width / 2;
		this.#offsetY = this.#height / 2;

		// ctx styles
		this.#ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
		this.#ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
	}

	render(camera: Camera, objects: Object3D[]) {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		for (const object3d of objects) {
			for (const polygon of object3d.polygons) {
				this.#drawPolygon(camera, polygon);
			}
		}
	}

	#drawPolygon(camera: Camera, polygon: Polygon) {
		const points = this.#getPointsOnScreen(camera, polygon);

		if (!points) {
			return;
		}

		const startPoint = points[0]!;

		this.#ctx.beginPath();
		this.#ctx.moveTo(startPoint.x, startPoint.y);

		for (let i = 1; i < points.length; i++) {
			const point = points[i]!;
			this.#ctx.lineTo(point.x, point.y);
		}

		this.#ctx.closePath();
		this.#ctx.fill();
		this.#ctx.stroke();
	}

	/**
	 *
	 * @returns array of points on the screen or undefined if points are out of the screen.
	 */
	#getPointsOnScreen(camera: Camera, polygon: Polygon): Vector2D[] | undefined {
		const points = polygon.vertexes.map((vertex) => camera.project(vertex));

		// TODO: need a function for checking if triangle is on the screen. Without this culling, optimization will be bad
		// if(points.every(point => !camera.isProjectedPointInViewport(point)))
		//     return undefined;

		return points.map((point) =>
			point
				.asVector2()
				.multiply(new Vector2D(this.#offsetX, this.#offsetY * this.#ratio))
				.add(new Vector2D(this.#offsetX, this.#offsetY)),
		);
	}
}
