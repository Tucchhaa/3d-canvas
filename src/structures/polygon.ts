import { Vector3 } from './vector';

export class Polygon {
	/**
	 * Should contain only 3 vertexes
	 */
	vertexes: Vector3[];

	constructor(...vertexes: Vector3[]) {
		this.vertexes = vertexes;
	}

	map(func: (vertex: Vector3) => Vector3): Polygon {
		const { length } = this.vertexes;
		const vertexes: Vector3[] = new Array(length);

		for (let i = 0; i < length; i++) {
			vertexes[i] = func(this.vertexes[i]!.clone());
		}

		return new Polygon(...vertexes);
	}
}
