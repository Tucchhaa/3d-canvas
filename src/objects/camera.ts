import { Matrix } from '../structures/matrix';
import { Vector3 } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type CameraConfig = {
	/** field of view in radians. */
	fov?: number;
	/** how much object is near to the camera. */
	near?: number;
	/** how much object is far from the camera. */
	far?: number;
};

export class Camera extends SpaceEntity {
	/**
	 * Field view in radians
	 */
	#scale!: number;

	#fov!: number;

	#projectionMatrix!: Matrix;
	#perspectiveMatrix!: Matrix;

	near: number;
	far: number;

	constructor(config: CameraConfig = {}, position: Vector3 = Vector3.zero) {
		super();

		this.setPosition(position);

		const { fov, near, far } = config;

		this.fov = fov ?? Math.PI / 3;
		this.near = near ?? 0.01;
		this.far = far ?? 5000;

		this.#initProjectionMatrix();
		this.#calculatePerspectiveMatrix();
	}

	get fov() {
		return this.#fov;
	}

	set fov(value: number) {
		this.#fov = value;
		this.#scale = 1 / Math.tan(this.fov / 2);
		this.#calculatePerspectiveMatrix();
	}

	// ===
	// Projection
	// ===

	project(transformedVertex: Vector3): Vector3 {
		/** This code does the same thing as code below, but a slower */
		// const projectionMatrix = this.#calculateProjectionMatrix(transformedVertex.z);
		// const point = transformedVertex.mmul(projectionMatrix);

		const point = transformedVertex;
		const w = -transformedVertex.z;
		point.x /= w;
		point.y /= w;

		if (point.z < this.near || point.z > this.far) {
			point.multiply(new Vector3(point.z, point.z, 1));
		}

		return point;
	}

	isProjectedPointInViewport(point: Vector3) {
		return point.z >= this.near && point.z <= this.far && point.x > -1 && point.x < 1 && point.y > -1 && point.y < 1;
	}

	// ===
	// Matrices
	// ===

	getTransformationMatrix() {
		const translationTo = this.position.getTranslationToOriginMatrix();

		const transformMatrix = translationTo.mmul(this.rotation).mmul(this.#perspectiveMatrix);

		return transformMatrix;
	}

	#initProjectionMatrix(): void {
		this.#projectionMatrix = Matrix.diagonal([0, 0, 1], 4, 4);
		this.#projectionMatrix.set(2, 3, 1);
	}

	#calculateProjectionMatrix(z: number): Matrix {
		/**
		 * W = -z
		 * projectionMatrix =
		 * 1/W   0    0   0
		 *  0   1/W   0   0
		 *  0    0    1   1
		 *  0    0    0   0
		 */
		this.#projectionMatrix.set(0, 0, -1 / z);
		this.#projectionMatrix.set(1, 1, -1 / z);

		return this.#projectionMatrix;
	}

	#calculatePerspectiveMatrix() {
		const { far, near } = this;

		/**
		 * f = far
		 * n = near
		 * perspectiveMatrix =
		 * scale   0        0        0
		 *   0    scale     0        0
		 *   0     0     f/(f-n)     1
		 *   0     0    f*n/(f-n)    0
		 */
		const perspectiveMatrix = Matrix.diagonal([this.#scale, this.#scale], 4, 4);
		perspectiveMatrix.set(2, 2, far / (far - near));
		perspectiveMatrix.set(3, 2, (far * near) / (far - near));
		perspectiveMatrix.set(2, 3, 1);

		this.#perspectiveMatrix = perspectiveMatrix;
	}
}
