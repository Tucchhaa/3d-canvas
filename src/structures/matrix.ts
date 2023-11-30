import { Matrix } from 'ml-matrix';

declare module 'ml-matrix' {
	export interface Matrix {
		asHomogeneous(): Matrix;
	}
}

Matrix.prototype.asHomogeneous = function (this: Matrix) {
	const matrix = new Matrix(this);

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

export { Matrix };
