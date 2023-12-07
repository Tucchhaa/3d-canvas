import { Geometry } from '../structures/geometry';
import { Matrix } from '../structures/matrix';
import { Vector3 } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type ObjectName = 'cube';

export type Object3DConfig = {
	geometry: Geometry;

	name?: string,
	pivot: Vector3;
	position: Vector3;
	scale: Vector3;
	direction: Vector3;
};

export class Object3D extends SpaceEntity {
	readonly geometry: Geometry;

	#scale: Vector3 = Vector3.one;

	constructor({ name, geometry, pivot, position, scale, direction }: Object3DConfig) {
		super(pivot);

		this.name = name ?? 'entity';

		this.geometry = geometry;
		this.setDirection(direction);
		this.setScale(scale);
		this.setPosition(position);
	}

	// ===

	setPosition(value: Vector3) {
		console.log(this.name, value);
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
			vertex.mmul(applyMatrix);
		}

		this.#scale = value;
	}

	/**
	 *
	 * @param direction rotation direction
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3, angle: number, pivot?: Vector3) {
		super.rotate(direction, angle);

		const rotationPivot = pivot ?? this.position;

		const rotation = Vector3.calculateRotationMatrix(direction, angle).asHomogeneous();
		const translateTo = rotationPivot.getTranslationToOriginMatrix();
		const translateFrom = rotationPivot.getTranslationFromOriginMatrix();

		const transformMatrix = translateTo.mmul(rotation).mmul(translateFrom);

		for (const vertex of this.geometry.vertexes) {
			vertex.mmul(transformMatrix);
		}
	}
}
