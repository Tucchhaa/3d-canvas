import { inverse, Matrix as BaseMatrix } from 'ml-matrix';

declare module 'ml-matrix' {
	export interface Matrix {
		asHomogeneous(): Matrix;
	}
}

BaseMatrix.prototype.asHomogeneous = function (this: BaseMatrix) {
	const matrix = new BaseMatrix(this);

	if (matrix.isRowVector()) {
		return matrix.addColumn(matrix.columns, [1]);
	}

	if (matrix.isColumnVector()) {
		return matrix.addRow(matrix.rows, [1]);
	}

	const column = Array(matrix.rows).fill(0);
	const row = Array(matrix.columns + 1).fill(0);

	row[matrix.columns] = 1;

	return matrix.addColumn(matrix.columns, column).addRow(matrix.rows, row);
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
