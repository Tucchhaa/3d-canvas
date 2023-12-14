import { Color } from './color';
import { Vector3 } from './vector';

export class Geometry {
	readonly vertexes: Vector3[];

	readonly #faces: number[][];

	#polygons: Polygon[] = [];

	get polygons() {
		return this.#polygons;
	}

	// ===
	constructor(vertexes: Vector3[], faces: number[][]) {
		this.vertexes = vertexes;
		this.#faces = faces;

		this.initializePolygons(faces);
	}

	initializePolygons(faces: number[][]) {
		for (const face of faces) {
			const polygon = new Polygon(face.map((vertexIndex) => this.vertexes[vertexIndex]!));

			this.#polygons.push(polygon);
		}
	}

	clone() {
		const clonedVertexes = this.vertexes.map((vertex) => vertex.clone());

		return new Geometry(clonedVertexes, this.#faces);
	}
}

export class Polygon {
	vertexes: Vector3[];

	color: Color = new Color(0, 150, 255);

	constructor(vertexes: Vector3[]) {
		this.vertexes = vertexes;
	}

	map(func: (vertex: Vector3) => Vector3): Polygon {
		const length = this.vertexes.length;
		const vertexes: Vector3[] = new Array(length);

		for (let i = 0; i < length; i++) {
			vertexes[i] = func(this.vertexes[i]!.clone());
		}

		return new Polygon(vertexes);
	}

	normal() {
		// Assuming that all vertexes of a polygon lie on the same plane, we can calculate only normal for three vertexes
		const [p1, p2, p3] = this.vertexes as [Vector3, Vector3, Vector3];

		const v1 = Vector3.subtract(p2, p1);
		const v2 = Vector3.subtract(p3, p1);

		const normal = Vector3.cross(v1, v2);
		
		return normal.unit();
	}
}
