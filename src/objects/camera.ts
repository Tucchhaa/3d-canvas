import { Matrix } from '../structures/matrix';
import { Vector3 } from '../structures/vector';
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

	constructor(config: CameraConfig = {}, position: Vector3 = Vector3.zero) {
		super();

		this.setPosition(position);

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
	project(vertex: Vector3) {
		const vectorFromCamera = Vector3.substract(vertex, this.position).mmul(this.rotation);

		const projectionMatrix = this.#calculateProjectionMatrix(vectorFromCamera.z);

		const point = vectorFromCamera.mmul(projectionMatrix).mmul(this.#perspectiveMatrix);

		if (point.z < this.near || point.z > this.far) {
			point.multiply(new Vector3(point.z, point.z, 1));
		}

		return point;
	}

	isProjectedPointInViewport(point: Vector3) {
		return point.z >= this.near && point.z <= this.far && point.x > -1 && point.x < 1 && point.y > -1 && point.y < 1;
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
