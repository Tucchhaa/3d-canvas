import { Geometry } from '../structures/geometry';
import { Vector3 } from '../structures/vector';

export class ResourceLoader {
	#cache: { [file: string]: string } = {};
	#cachedObjects: { [file: string]: Geometry } = {};

	async #loadRawFile(file: string): Promise<string> {
		if (this.#cache[file]) {
			return Promise.resolve(this.#cache[file]!);
		}

		return new Promise((resolve) => {
			const rawFile = new XMLHttpRequest();

			rawFile.open('GET', file, false);
			rawFile.onreadystatechange = () => {
				if (rawFile.readyState === 4) {
					if (rawFile.status === 200 || rawFile.status === 0) {
						this.#cache[file] = rawFile.responseText;

						resolve(rawFile.responseText);
					}
				}
			};
			rawFile.send(null);
		});
	}

	// ===
	// Loaders
	// ===
	async loadObject(name: string): Promise<ResourceLoader> {
		if (this.#cachedObjects[name]) {
			return this;
		}

		const data = await this.#loadRawFile(`resources/objects/${name}.obj`);
		const geometry = this.#parseObject(data);

		this.#cachedObjects[name] = geometry;

		return this;
	}

	// ===
	// Parsers
	// ===
	#parseObject(raw: string) {
		const vertexMatches = raw.match(/^v( -?\d+(\.\d+)?){3}$/gm);

		const vertexes = vertexMatches?.map((vertex) => {
			const coordinates = vertex
				.split(' ')
				.slice(1)
				.map((num) => Number(num));

			return new Vector3(coordinates[0]!, coordinates[1]!, coordinates[2]!);
		});

		// ===
		const facesMatches = raw.match(/^f(.*)([^\n]*\n+)/gm);

		const faces = facesMatches?.map((face) =>
			face
				.split(' ')
				.slice(1)
				.map((f) => Number(f.split('/')[0]) - 1),
		);

		if (!faces || !vertexes) {
			throw new Error('Unsupported .obj format');
		}

		return new Geometry(
			vertexes as Vector3[],
			faces as number[][],
		);
	}

	// ===
	// Getters
	// ===
	getObject(name: string) {
		const obj = this.#cachedObjects[name];

		if (!obj)
			throw new Error(`Object '${name}' is undefined when tried to access it`);

		return obj.clone();
	}
}
