import { Geometry } from '../structures/geometry';
import { Matrix } from '../structures/matrix';
import { Vector3 } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type ObjectName = 'cube';

export type Object3DConfig = {
	geometry: Geometry;

	position: Vector3;
	scale: Vector3;
	direction: Vector3;
};

export class Object3D extends SpaceEntity {
	readonly geometry: Geometry;

	#scale: Vector3 = Vector3.one;

	constructor({ geometry, position, scale, direction }: Object3DConfig) {
		super();

		this.geometry = geometry;
		this.setDirection(direction);
		this.setScale(scale);
		this.setPosition(position);
	}

	// ===

	setPosition(value: Vector3) {
		const translationVector = Vector3.substract(value, this.position);

		for (const vertex of this.geometry.vertexes) {
			vertex.add(translationVector);
		}

		super.setPosition(value);
	}

	get scale() {
		return this.#scale;
	}

	public setScale(value: Vector3) {
		const translate = this.position.getTranslationToOriginMatrix();
		const translateBack = this.position.getTranslationFromOriginMatrix();

		const scaleRatio = Vector3.divide(value, this.#scale);
		const scaleMatrix = Matrix.diag(scaleRatio.asArray()).asHomogeneous();

		const applyMatrix = translate.mmul(scaleMatrix).mmul(translateBack);

		for (const vertex of this.geometry.vertexes) {
			const vector = vertex.asRowVector().asHomogeneous();

			const result = vector.mmul(applyMatrix);

			vertex.set(Vector3.fromMatrix(result));
		}

		this.#scale = value;
	}

	/**
	 *
	 * @param direction rotation direction
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3, angle: number) {
		super.rotate(direction, angle);

		const rotation = Vector3.calculateRotationMatrix(direction, angle).asHomogeneous();
		const translateTo = this.position.getTranslationToOriginMatrix();
		const translateFrom = this.position.getTranslationFromOriginMatrix();

		const matrix = translateTo.mmul(rotation).mmul(translateFrom);

		for (const vertex of this.geometry.vertexes) {
			const rotatedVertex = vertex.asRowVector().asHomogeneous().mmul(matrix);

			vertex.set(Vector3.fromMatrix(rotatedVertex));
		}
	}
}
