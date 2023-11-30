import Matrix from 'ml-matrix';

import { Vector3D } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type CameraConfig = {
	fov?: number;
	near?: number;
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

	constructor(
		config: CameraConfig = {},
		position: Vector3D = Vector3D.zero,
		direction: Vector3D = Vector3D.backward,
	) {
		super();

		this.setPosition(position);
		this.setDirection(direction);

		const { fov, near, far } = config;

		this.fov = fov ?? Math.PI / 3;
		this.near = near ?? 0.01;
		this.far = far ?? 5000;

		this.#initProjectionMatrix();
		this.#preparePerspectiveMatrix();
	}

	get fov() {
		return this.#fov;
	}
	set fov(value: number) {
		this.#fov = value;
		this.#scale = 1 / Math.tan(this.fov / 2);
	}

	// ===
	// Projection and perspective
	// ===
	project(vertex: Vector3D) {
		const vectorFromCamera = Vector3D.substract(vertex, this.position);
		// const forw = new Vector3(0, this.direction.y, this.direction.z).unit();

		const angle = Vector3D.getAngleBetween(Vector3D.forward, this.direction);
		const cross = Vector3D.cross(Vector3D.forward, this.direction);

		const normal = cross.unit();
		// console.log('before: ', vectorFromCamera);
		if (cross.sqrMagnitude() !== 0) {
			vectorFromCamera.rotate(normal, angle);
		} else if (angle == Math.PI) {
			vectorFromCamera.z = -vectorFromCamera.z;
			vectorFromCamera.x = -vectorFromCamera.x;
			// vectorFromCamera.y = -vectorFromCamera.y;

			// vectorFromCamera.multiply(-1);
		}

		// console.log('normal: ', normal, '\nangle:', angle * 180/Math.PI, '\nvector: ', vectorFromCamera);

		const projectionMatrix = this.#calculateProjectionMatrix(
			vectorFromCamera.z,
		);

		const homogeneousVector = vectorFromCamera.asRowVector().asHomogeneous();

		const projectionVector = homogeneousVector
			.mmul(projectionMatrix)
			.mmul(this.#perspectiveMatrix);

		const point = Vector3D.fromMatrix(projectionVector);

		if (point.z < this.near || point.z > this.far) {
			point.multiply(new Vector3D(point.z, point.z, 1));
		}

		return point;
	}

	isProjectedPointInViewport(point: Vector3D) {
		return (
			point.z >= this.near &&
			point.z <= this.far &&
			point.x > -1 &&
			point.x < 1 &&
			point.y > -1 &&
			point.y < 1
		);
	}

	#initProjectionMatrix(): void {
		this.#projectionMatrix = Matrix.diagonal([0, 0, 1], 4, 4);
		this.#projectionMatrix.set(2, 3, 1);
	}

	#calculateProjectionMatrix(z: number): Matrix {
		/*
        W = -z
        projectionMatrix = 
            1/W  0     0   0
            0    1/W  0   0
            0    0     -1  -1
            0    0     0   0
        */
		this.#projectionMatrix.set(0, 0, -1 / z);
		this.#projectionMatrix.set(1, 1, -1 / z);

		return this.#projectionMatrix;
	}

	#preparePerspectiveMatrix() {
		const { far, near } = this;

		/*
        perspectiveMatrix = 
            scale  0      0         0
            0      scale  0         0
            0      0      f/(f-n)  1
            0      0      f*n(f-n) 0
        */
		const perspectiveMatrix = Matrix.diagonal([this.#scale, this.#scale], 4, 4);
		perspectiveMatrix.set(2, 2, far / (far - near));
		perspectiveMatrix.set(3, 2, (far * near) / (far - near));
		perspectiveMatrix.set(2, 3, 1);

		this.#perspectiveMatrix = perspectiveMatrix;
	}
}
