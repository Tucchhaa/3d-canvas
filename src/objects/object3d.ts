import { Matrix } from 'ml-matrix';

import { Polygon } from '../structures/polygon';
import { Vector3D } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type ObjectName = 'cube';

export class Object3D extends SpaceEntity {
	readonly polygons: Polygon[];
	#scale: Vector3D = Vector3D.one;

	constructor(
		polygons: Polygon[],
		position: Vector3D = Vector3D.zero,
		scale: Vector3D = Vector3D.one,
		direction = Vector3D.forward,
	) {
		super();

		direction;
		this.polygons = polygons;
		this.setScale(scale);
		this.setPosition(position);
	}

	setPosition(value: Vector3D) {
		const translationVector = Vector3D.substract(value, this.position);

		for (const polygon of this.polygons) {
			for (const vertex of polygon.vertexes) {
				vertex.add(translationVector);
			}
		}

		super.setPosition(value);
	}

	get scale() {
		return this.#scale;
	}

	public setScale(value: Vector3D) {
		const translate = this.position.getTranslationToOriginMatrix();
		const translateBack = this.position.getTranslationFromOriginMatrix();

		const scaleRatio = Vector3D.divide(value, this.#scale);
		const scaleMatrix = Matrix.diag(scaleRatio.asArray()).asHomogeneous();

		const applyMatrix = translate.mmul(scaleMatrix).mmul(translateBack);

		for (const polygon of this.polygons) {
			for (const vertex of polygon.vertexes) {
				const vector = vertex.asRowVector().asHomogeneous();

				const result = vector.mmul(applyMatrix);

				vertex.set(Vector3D.fromMatrix(result));
			}
		}

		this.#scale = value;
	}

	/**
	 *
	 * @param direction rotation direction
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3D, angle: number) {
		super.rotate(direction, angle);

		const rotation = Vector3D.calculateRotationMatrix(
			direction,
			angle,
		).asHomogeneous();
		const translateTo = this.position.getTranslationToOriginMatrix();
		const translateFrom = this.position.getTranslationFromOriginMatrix();

		const matrix = translateTo.mmul(rotation).mmul(translateFrom);

		for (const polygon of this.polygons) {
			for (const vertex of polygon.vertexes) {
				const rotatedVertex = vertex.asRowVector().asHomogeneous().mmul(matrix);

				vertex.set(Vector3D.fromMatrix(rotatedVertex));
			}
		}
	}
}

export class Cube extends Object3D {
	constructor(
		position: Vector3D = Vector3D.zero,
		scale: Vector3D = Vector3D.one,
		direction: Vector3D = Vector3D.forward,
	) {
		const polygons = [
			// left
			new Polygon(
				new Vector3D(-0.5, -0.5, +0.5),
				new Vector3D(-0.5, +0.5, +0.5),
				new Vector3D(-0.5, -0.5, -0.5),
			),
			new Polygon(
				new Vector3D(-0.5, +0.5, -0.5),
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(-0.5, +0.5, +0.5),
			),

			// front
			new Polygon(
				new Vector3D(-0.5, -0.5, +0.5),
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(+0.5, +0.5, +0.5),
			),
			new Polygon(
				new Vector3D(-0.5, -0.5, +0.5),
				new Vector3D(+0.5, +0.5, +0.5),
				new Vector3D(-0.5, +0.5, +0.5),
			),

			// right
			new Polygon(
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(+0.5, +0.5, -0.5),
			),
			new Polygon(
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(+0.5, +0.5, -0.5),
				new Vector3D(+0.5, +0.5, +0.5),
			),

			// back
			new Polygon(
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(-0.5, +0.5, -0.5),
			),
			new Polygon(
				new Vector3D(+0.5, +0.5, -0.5),
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(-0.5, +0.5, -0.5),
			),

			// bottom
			new Polygon(
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(-0.5, -0.5, +0.5),
			),
			new Polygon(
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, +0.5),
			),

			// top
			new Polygon(
				new Vector3D(-0.5, +0.5, -0.5),
				new Vector3D(-0.5, +0.5, +0.5),
				new Vector3D(+0.5, +0.5, +0.5),
			),
			new Polygon(
				new Vector3D(-0.5, +0.5, -0.5),
				new Vector3D(+0.5, +0.5, +0.5),
				new Vector3D(+0.5, +0.5, -0.5),
			),
		];

		super(polygons, position, scale, direction);
	}
}

export class Pyramid extends Object3D {
	constructor(
		position: Vector3D = Vector3D.zero,
		scale: Vector3D = Vector3D.one,
		direction: Vector3D = Vector3D.forward,
	) {
		const polygons = [
			// left
			new Polygon(
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(-0.5, -0.5, +0.5),
				new Vector3D(0, 0.5, +0),
			),

			// front
			new Polygon(
				new Vector3D(-0.5, -0.5, +0.5),
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(0, 0.5, +0),
			),

			// right
			new Polygon(
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(0, 0.5, +0),
			),

			// back
			new Polygon(
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(0, 0.5, +0),
			),

			// bottom
			new Polygon(
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, +0.5),
				new Vector3D(-0.5, -0.5, +0.5),
			),
			new Polygon(
				new Vector3D(-0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, -0.5),
				new Vector3D(+0.5, -0.5, +0.5),
			),
		];

		super(polygons, position, scale, direction);
	}
}
