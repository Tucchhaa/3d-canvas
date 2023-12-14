import { Geometry } from '../structures/geometry';
import { Vector3 } from '../structures/vector';

export class ResourceLoader {
	#cache = new Map<string, Geometry>();

	async #loadRawFile(file: string) {
		return (await fetch(file)).text();
	}

	// ===
	// Loaders
	// ===
	async loadObject(name: string): Promise<ResourceLoader> {
		if (!this.#cache.has(name)) {
			const data = await this.#loadRawFile(`resources/objects/${name}.obj`);
			const geometry = this.#parseObject(data);
			this.#cache.set(name, geometry);
		}
		return this;
	}

	// ===
	// Parsers
	// ===
	#parseObject(raw: string) {
		const vertexMatches = raw.match(/^v( +-?\d+(\.\d+)?){3}$/gm);

		const vertexes = vertexMatches?.map((vertex) => {
			const coordinates = vertex
				.trim()
				.split(' ')
				.slice(1)
				.map((num) => Number(num));

			return new Vector3(coordinates[0]!, coordinates[1]!, coordinates[2]!);
		});

		// ===
		const faceMatches = raw.match(/^f(.*)([^\n]*\n+)/gm);

		const faces = faceMatches?.map((face) =>
			face
				.split(' ')
				.slice(1)
				.map((f) => Number(f.split('/')[0]) - 1),
		);

		if (!faces || !vertexes) {
			throw new Error('Unsupported .obj format');
		}

		return new Geometry(vertexes as Vector3[], faces as number[][]);
	}

	// ===
	// Getters
	// ===
	getObject(name: string) {
		const obj = this.#cache.get(name);

		if (!obj) throw new Error(`Object '${name}' is undefined when tried to access it`);

		return obj.clone();
	}
}
