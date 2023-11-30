import { Matrix } from 'ml-matrix';

export class Vector3D {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}

	// ===
	sqrMagnitude() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	magnitude() {
		return Math.sqrt(this.sqrMagnitude());
	}

	setMagnitude(magnitude: number) {
		const coefficient = magnitude / this.magnitude();

		this.multiply(coefficient);

		return this;
	}

	/**
	 *
	 * @returns unit vector
	 */
	unit() {
		const magnitude = this.magnitude();

		return Vector3D.divide(this, magnitude);
	}

	// ===
	// Simple vectors
	// ===
	static get zero() {
		return new Vector3D(0, 0, 0);
	}

	static get one() {
		return new Vector3D(1, 1, 1);
	}

	static get up() {
		return new Vector3D(0, 1, 0);
	}

	static get down() {
		return new Vector3D(0, -1, 0);
	}

	static get forward() {
		return new Vector3D(0, 0, 1);
	}

	static get backward() {
		return new Vector3D(0, 0, -1);
	}

	// if look along Z axis, your right side will be on the negative x
	static get right() {
		return new Vector3D(-1, 0, 0);
	}

	static get left() {
		return new Vector3D(1, 0, 0);
	}

	// ===
	// Transformations
	// ===
	/**
	 *
	 * @param direction rotation direction
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3D, angle: number) {
		const rotation = Vector3D.calculateRotationMatrix(direction, angle);

		const result = this.asRowVector().mmul(rotation);

		this.set(Vector3D.fromMatrix(result));
	}

	// ===
	// Matrices
	// ===
	getTranslationToOriginMatrix(): Matrix {
		const matrix = Matrix.identity(4, 4);

		matrix.set(3, 0, -this.x);
		matrix.set(3, 1, -this.y);
		matrix.set(3, 2, -this.z);

		return matrix;
	}

	getTranslationFromOriginMatrix(): Matrix {
		const matrix = Matrix.identity(4, 4);

		matrix.set(3, 0, this.x);
		matrix.set(3, 1, this.y);
		matrix.set(3, 2, this.z);

		return matrix;
	}

	asColumnVector(): Matrix {
		return new Matrix([[this.x], [this.y], [this.z]]);
	}

	asRowVector(): Matrix {
		return new Matrix([[this.x, this.y, this.z]]);
	}

	static fromMatrix(matrix: Matrix) {
		if (!matrix.isVector()) {
			throw new Error();
		}

		return Vector3D.fromArray(matrix.to1DArray() as [number, number, number]);
	}

	static fromArray(array: [number, number, number]) {
		const [x, y, z] = array;
		return new Vector3D(x, y, z);
	}

	// ===
	// Data convertations
	// ===
	asArray() {
		return [this.x, this.y, this.z];
	}

	asVector2() {
		return new Vector2(this.x, this.y);
	}

	clone() {
		return new Vector3D(this.x, this.y, this.z);
	}

	set(vector: Vector3D) {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
	}

	// ===
	// Mutable arithmetic
	// ===
	add(a: Vector3D): Vector3D {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;

		return this;
	}

	substract(a: Vector3D): Vector3D {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;

		return this;
	}

	multiply(a: Vector3D): Vector3D;
	multiply(scalar: number): Vector3D;
	multiply(a: Vector3D | number): Vector3D {
		if (a instanceof Vector3D) {
			this.x *= a.x;
			this.y *= a.y;
			this.z *= a.z;
		} else {
			this.x *= a;
			this.y *= a;
			this.z *= a;
		}

		return this;
	}

	divide(scalar: number): Vector3D {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	// ===
	// Immutable arithmetic
	// ===
	static add(a: Vector3D, b: Vector3D): Vector3D {
		return new Vector3D(a.x + b.x, a.y + b.y, a.z + b.z);
	}

	static multiply(a: Vector3D, scalar: number): Vector3D;
	static multiply(a: Vector3D, b: Vector3D): Vector3D;
	static multiply(a: Vector3D, b: Vector3D | number): Vector3D {
		// console.log(a, b);
		if (b instanceof Vector3D)
			return new Vector3D(a.x * b.x, a.y * b.y, a.z * b.z);

		return new Vector3D(a.x * b, a.y * b, a.z * b);
	}

	static substract(a: Vector3D, b: Vector3D): Vector3D {
		return new Vector3D(a.x - b.x, a.y - b.y, a.z - b.z);
	}

	static divide(a: Vector3D, scalar: number): Vector3D;
	static divide(a: Vector3D, b: Vector3D): Vector3D;
	static divide(a: Vector3D, b: Vector3D | number): Vector3D {
		if (b instanceof Vector3D)
			return new Vector3D(a.x / b.x, a.y / b.y, a.z / b.z);

		return new Vector3D(a.x / b, a.y / b, a.z / b);
	}

	// ===
	// Vector multiplication
	// ===
	static dot(a: Vector3D, b: Vector3D): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	static cross(a: Vector3D, b: Vector3D): Vector3D {
		return new Vector3D(
			a.y * b.z - a.z * b.y,
			a.x * b.z - a.z * b.x,
			a.x * b.y - a.y * b.x,
		);
	}

	// ===
	// Roations
	// ===
	/**
	 * Returns angle between two direction vectors
	 * @param a unit vector
	 * @param b unit vector
	 * @returns angle in radians
	 */
	static getAngleBetween(a: Vector3D, b: Vector3D): number {
		const dotProduct = Vector3D.dot(a, b);

		if (dotProduct >= 1) return 0;

		if (dotProduct <= -1) return Math.PI;

		return Math.acos(dotProduct);
	}

	static calculateRotationMatrix(direction: Vector3D, angle: number): Matrix {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const Q = Matrix.identity(3, 3).mul(cos);

		const d = direction;

		const m = direction
			.asColumnVector()
			.mmul(direction.asRowVector())
			.mul(1 - cos);
		const n = new Matrix([
			[0, d.z, -d.y],
			[-d.z, 0, d.x],
			[d.y, -d.x, 0],
		]).mul(sin);

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const value = Q.get(i, j) + m.get(i, j) - n.get(i, j);

				Q.set(i, j, value);
			}
		}

		return Q;
	}
}

export class Vector2 {
	constructor(
		public x: number,
		public y: number,
	) {}

	// ===
	// Mutable arithmetic
	// ===
	add(scalar: number): Vector2;
	add(a: Vector2): Vector2;
	add(a: Vector2 | number): Vector2 {
		if (a instanceof Vector2) {
			this.x += a.x;
			this.y += a.y;
		}
		// a is scalar
		else {
			this.x += a;
			this.y += a;
		}

		return this;
	}

	/**
	 * Scalar multiplication
	 */
	multiply(a: Vector2): Vector2;
	multiply(scalar: number): Vector2;
	multiply(a: Vector2 | number): Vector2 {
		if (a instanceof Vector2) {
			this.x *= a.x;
			this.y *= a.y;
		}
		// a is a scalar
		else {
			this.x *= a;
			this.y *= a;
		}

		return this;
	}

	// ===
	static get zero() {
		return new Vector2(0, 0);
	}

	static get one() {
		return new Vector2(1, 1);
	}
}
