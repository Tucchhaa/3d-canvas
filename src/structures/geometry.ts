import { Vector3 } from './vector';

export class Geometry {
	readonly vertexes: Vector3[];

	readonly #faces: number[][];

	constructor(vertexes: Vector3[], faces: number[][]) {
		this.vertexes = vertexes;
		this.#faces = faces;
	}

	*iteratePolygons() {
		for (const face of this.#faces) {
			const polygon = new Polygon(face.map(vertexIndex => this.vertexes[vertexIndex]!));

			yield polygon;
		}
	}

	clone() {
		const clonedVertexes = this.vertexes.map((vertex) => vertex.clone());

		return new Geometry(clonedVertexes, this.#faces);
	}
}

export class Polygon {
	/**
	 * Should contain only 3 vertexes
	 */
	vertexes: Vector3[];

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
}
