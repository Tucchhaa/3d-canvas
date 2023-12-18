import { inverse, Matrix as BaseMatrix } from 'ml-matrix';

declare module 'ml-matrix' {
	export interface Matrix {
		asHomogeneous(): Matrix;
	}
}

BaseMatrix.prototype.asHomogeneous = function (this: BaseMatrix) {
	if (this.isRowVector()) {
		return this.addColumn(this.columns, [1]);
	}

	if (this.isColumnVector()) {
		return this.addRow(this.rows, [1]);
	}

	const column = Array(this.rows).fill(0);
	const row = Array(this.columns + 1).fill(0);

	row[this.columns] = 1;

	return this.addColumn(this.columns, column).addRow(this.rows, row);
};

export class Matrix extends BaseMatrix {
	/**
	 * Projects vector onto a plane
	 * @returns projection
	 */
	static project(plane: Matrix, vector: Matrix): Matrix {
		if (vector.isColumnVector() === false) {
			throw new Error();
		}

		const x = inverse(plane.transpose().mmul(plane));

		const P = plane.mmul(x).mmul(plane.transpose());

		const projection = P.mmul(vector);

		return projection;
	}

	static get YZPlane() {
		return new Matrix([
			[0, 0],
			[1, 0],
			[0, 1],
		]);
	}

	static get XZPlane() {
		return new Matrix([
			[1, 0],
			[0, 0],
			[0, 1],
		]);
	}

	static get XYPlane() {
		return new Matrix([
			[1, 0],
			[0, 1],
			[0, 0],
		]);
	}
}
