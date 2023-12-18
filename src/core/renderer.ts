import { Camera } from '../objects/camera';
import { LightSource } from '../objects/light-source';
import { Object3D } from '../objects/object3d';
import { Color } from '../structures/color';
import { Polygon } from '../structures/geometry';
import { Vector3 } from '../structures/vector';
import { Scene } from './scene';

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

	// ===
	// Canvas manipulations
	// ===
	updateDimensions() {
		this.#canvas.width = this.#width = this.#canvas.offsetWidth * 2;
		this.#canvas.height = this.#height = this.#canvas.offsetHeight * 2;

		this.#ratio = this.#width / this.#height;

		this.#offsetX = this.#width / 2;
		this.#offsetY = this.#height / 2;

		// ctx styles
		this.#ctx.strokeStyle = 'rgba(0, 0, 0)';
		this.#ctx.fillStyle = 'rgba(0, 150, 255)';
	}

	public clearScreen() {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	// ===

	public render(scene: Scene): void {
		this.clearScreen();

		const renderedPolygons: Polygon[] = [];

		for (const object3d of scene.getObjects()) {
			renderedPolygons.push(...this.#renderObject(scene.mainCamera, scene.lights, object3d));
		}

		renderedPolygons.sort(this.ZSort);

		for (const renderedPolygon of renderedPolygons) {
			this.#drawPolygon(renderedPolygon);
		}
	}

	// TODO: this algorithm does not always work properly
	// also some polygons has more than 3 vertexes
	private ZSort(a: Polygon, b: Polygon) {
		const points1 = a.vertexes;
		const points2 = b.vertexes;

		return points2[0]!.z + points2[1]!.z + points2[2]!.z - (points1[0]!.z + points1[1]!.z + points1[2]!.z);
	}

	/**
	 * Backface culling
	 */
	private isBackface(polygon: Polygon) {
		// P.S. not really sure why this works
		// also some polygons has more than 3 vertexes
		const [p1, p2, p3] = polygon.vertexes as [Vector3, Vector3, Vector3];

		return (p2.x - p1.x) * (p3.y - p1.y) >= (p3.x - p1.x) * (p2.y - p1.y);
	}

	/**
	 * Projects polygon onto screen and applies lights on it
	 */
	#renderObject(camera: Camera, lights: LightSource[], object3d: Object3D): Polygon[] {
		const result = [];

		const transformationMatrix = camera.getTransformationMatrix();

		for (const polygon of object3d.geometry.polygons) {
			const transformedPolygon = polygon.map((vertex) => vertex.mmul(transformationMatrix));

			if(camera.isPolygonInFrustum(transformedPolygon) === false) {
				continue;
			}

			const projectedPolygon = transformedPolygon.forEach((vertex) =>
				camera
					.project(vertex)
					.multiply(new Vector3(this.#offsetX, this.#offsetY * this.#ratio, 1))
					.add(new Vector3(this.#offsetX, this.#offsetY, 0))
			);

			const isCulled = object3d.backfaceCullingEnabled === true && this.isBackface(projectedPolygon);
			const isVisible = !isCulled;

			if (isVisible) {
				projectedPolygon.color = this.#calculateColors(lights, object3d, polygon);

				result.push(projectedPolygon);
			}
		}

		return result;
	}

	#calculateColors(lights: LightSource[], object3d: Object3D, polygon: Polygon): Color {
		const normal = polygon.normal();
		const lightningColor = new Color(0, 0, 0, 1);

		for (const light of lights) {
			light.applyLight(polygon, normal, lightningColor);
		}

		const color = object3d.color.copy();
		color.r = ((color.r * lightningColor.r) / 255) * lightningColor.a;
		color.g = ((color.g * lightningColor.g) / 255) * lightningColor.a;
		color.b = ((color.b * lightningColor.b) / 255) * lightningColor.a;

		return color;
	}

	#drawPolygon(renderedPolygon: Polygon) {
		const points = renderedPolygon.vertexes;

		const startPoint = points[0]!;

		const color = renderedPolygon.color.toString();
		this.#ctx.strokeStyle = color;
		this.#ctx.fillStyle = color;

		this.#ctx.beginPath();
		this.#ctx.moveTo(Math.floor(startPoint.x), Math.floor(startPoint.y));

		for (let i = 1; i < points.length; i++) {
			const point = points[i]!;
			this.#ctx.lineTo(Math.floor(point.x), Math.floor(point.y));
		}

		this.#ctx.closePath();
		this.#ctx.fill();
		this.#ctx.stroke();
	}
}
