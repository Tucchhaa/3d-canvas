import { Vector3 } from './vector';

export class Geometry {
	readonly vertexes: Vector3[];

	readonly #faces: Array<[number, number, number]>;

	constructor(vertexes: Vector3[], faces: Array<[number, number, number]>) {
		this.vertexes = vertexes;
		this.#faces = faces;
	}

	*iteratePolygons() {
		for (const face of this.#faces) {
			const polygon = new Polygon([
				this.vertexes[face[0]]!,
				this.vertexes[face[1]]!,
				this.vertexes[face[2]]!,
			]);

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
	vertexes: [Vector3, Vector3, Vector3];

	constructor(vertexes: [Vector3, Vector3, Vector3]) {
		this.vertexes = vertexes;
	}

	map(func: (vertex: Vector3) => Vector3): Polygon {
		const length = 3;
		const vertexes: [Vector3, Vector3, Vector3] = new Array(length) as [Vector3, Vector3, Vector3];

		for (let i = 0; i < length; i++) {
			vertexes[i] = func(this.vertexes[i]!.clone());
		}

		return new Polygon(vertexes);
	}
}
