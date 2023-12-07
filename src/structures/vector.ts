import { Matrix } from './matrix';

export class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}

	// ===
	get sqrMagnitude() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	get magnitude() {
		return Math.sqrt(this.sqrMagnitude);
	}

	setMagnitude(magnitude: number) {
		const coefficient = magnitude / this.magnitude;

		this.multiply(coefficient);

		return this;
	}

	/**
	 *
	 * @returns unit vector
	 */
	unit() {
		const magnitude = this.magnitude;

		return Vector3.divide(this, magnitude);
	}

	// ===
	// Simple vectors
	// ===
	static get zero() {
		return new Vector3(0, 0, 0);
	}

	static get one() {
		return new Vector3(1, 1, 1);
	}

	static get up() {
		return new Vector3(0, 1, 0);
	}

	static get down() {
		return new Vector3(0, -1, 0);
	}

	static get forward() {
		return new Vector3(0, 0, 1);
	}

	static get backward() {
		return new Vector3(0, 0, -1);
	}

	// if look along Z axis, your right side will be on the negative x
	static get right() {
		return new Vector3(-1, 0, 0);
	}

	static get left() {
		return new Vector3(1, 0, 0);
	}

	// ===
	// Transformations
	// ===
	/**
	 *
	 * @param direction rotation direction
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3, angle: number) {
		const rotation = Vector3.calculateRotationMatrix(direction, angle);

		const result = this.asRowVector().mmul(rotation);

		this.set(Vector3.fromMatrix(result));
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

		return Vector3.fromArray(matrix.to1DArray() as [number, number, number]);
	}

	static fromArray(array: [number, number, number]) {
		return new Vector3(...array);
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
		return new Vector3(this.x, this.y, this.z);
	}

	set(vector: Vector3) {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
	}

	// ===
	// Mutable arithmetic
	// ===
	add(a: Vector3): Vector3 {
		this.x += a.x;
		this.y += a.y;
		this.z += a.z;

		return this;
	}

	substract(a: Vector3): Vector3 {
		this.x -= a.x;
		this.y -= a.y;
		this.z -= a.z;

		return this;
	}

	multiply(a: Vector3): Vector3;
	multiply(scalar: number): Vector3;
	multiply(a: Vector3 | number): Vector3 {
		if (a instanceof Vector3) {
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

	divide(scalar: number): Vector3 {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	mmul(matrix: Matrix): Vector3 {
		this.set(Vector3.mmul(this, matrix));

		return this;
	}

	// ===
	// Immutable arithmetic
	// ===
	static add(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
	}

	static multiply(a: Vector3, scalar: number): Vector3;
	static multiply(a: Vector3, b: Vector3): Vector3;
	static multiply(a: Vector3, b: Vector3 | number): Vector3 {
		if (b instanceof Vector3) return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);

		return new Vector3(a.x * b, a.y * b, a.z * b);
	}

	static substract(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
	}

	static divide(a: Vector3, scalar: number): Vector3;
	static divide(a: Vector3, b: Vector3): Vector3;
	static divide(a: Vector3, b: Vector3 | number): Vector3 {
		if (b instanceof Vector3) return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);

		return new Vector3(a.x / b, a.y / b, a.z / b);
	}

	static mmul(vector: Vector3, matrix: Matrix): Vector3 {
		const isHomogeneous = matrix.rows === 4;

		if(isHomogeneous) {
			return new Vector3(
				vector.x * matrix.get(0, 0) + vector.y * matrix.get(1, 0) + vector.z * matrix.get(2, 0) + matrix.get(3, 0),
				vector.x * matrix.get(0, 1) + vector.y * matrix.get(1, 1) + vector.z * matrix.get(2, 1) + matrix.get(3, 1),
				vector.x * matrix.get(0, 2) + vector.y * matrix.get(1, 2) + vector.z * matrix.get(2, 2) + matrix.get(3, 2),
			);
		}

		return new Vector3(
			vector.x * matrix.get(0, 0) + vector.y * matrix.get(1, 0) + vector.z * matrix.get(2, 0),
			vector.x * matrix.get(0, 1) + vector.y * matrix.get(1, 1) + vector.z * matrix.get(2, 1),
			vector.x * matrix.get(0, 2) + vector.y * matrix.get(1, 2) + vector.z * matrix.get(2, 2),
		);
		
		/*
			Code below is really slow, but does the same thing as code above
		*/

		// const vectorMatrix = isHomogeneous ? vector.asRowVector().asHomogeneous() : vector.asRowVector();
		// const mmul = vectorMatrix.mmul(matrix);
		// const result = Vector3.fromMatrix(mmul);

		// return result;
	}

	// ===
	// Vector multiplication
	// ===
	static dot(a: Vector3, b: Vector3): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	static cross(a: Vector3, b: Vector3): Vector3 {
		return new Vector3(a.y * b.z - a.z * b.y, a.x * b.z - a.z * b.x, a.x * b.y - a.y * b.x);
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
	static getAngleBetween(a: Vector3, b: Vector3): number {
		let dot = Vector3.dot(a, b);

		dot = Math.max(-1, Math.min(1, dot));

		const result = Math.acos(dot);

		return result;
	}

	static calculateRotationMatrix(direction: Vector3, angle: number): Matrix {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const rotation = Matrix.identity(3, 3).mul(cos);

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
				const value = rotation.get(i, j) + m.get(i, j) - n.get(i, j);

				rotation.set(i, j, value);
			}
		}

		return rotation;
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
