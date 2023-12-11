import { Vector3 } from './vector';

export class Geometry {
	constructor(
		readonly vertexes: Vector3[],
		readonly vertexIndices: number[][],
		readonly textures?: Vector3[],
		readonly textureIndices?: number[][],
	) {}

	*iteratePolygons() {
		for (const vertexIndices of this.vertexIndices) {
			const polygon = new Polygon(vertexIndices.map((i) => this.vertexes[i]!));

			yield polygon;
		}

		if (this.textures && this.textureIndices) {
			for (const textureIndices of this.textureIndices) {
				const polygon = new Polygon(textureIndices.map((i) => this.textures![i]!));

				yield polygon;
			}
		}
	}

	clone() {
		const clonedVertexes = this.vertexes.map((vertex) => vertex.clone());
		const clonedTextures = this.textures?.map((texture) => texture.clone());

		return new Geometry(clonedVertexes, this.vertexIndices, clonedTextures, this.textureIndices);
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
