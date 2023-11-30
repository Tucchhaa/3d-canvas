import { Vector3D } from './vector';

export class Polygon {
	/**
	 * Should contain only 3 vertexes
	 */
	vertexes: Vector3D[];

	constructor(...vertexes: Vector3D[]) {
		this.vertexes = vertexes;
	}

	map(func: (vertex: Vector3D) => Vector3D): Polygon {
		const { length } = this.vertexes;
		const vertexes: Vector3D[] = new Array(length);

		for (let i = 0; i < length; i++) {
			vertexes[i] = func(this.vertexes[i]!.clone());
		}

		return new Polygon(...vertexes);
	}
}
