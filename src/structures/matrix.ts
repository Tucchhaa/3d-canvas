import { Matrix } from 'ml-matrix';

declare module 'ml-matrix' {
    export interface Matrix {
        toHomogeneous(): Matrix;
    }
}

Matrix.prototype.toHomogeneous = function(this: Matrix) {
    if(this.isRowVector()) {
        return this.addColumn(this.columns, [1]);
    }

    if(this.isColumnVector()) {
        return this.addRow(this.rows, [1]);
    }

    const column = Array(this.rows).fill(0);
    const row = Array(this.columns + 1).fill(0);

    row[this.columns] = 1;

    return this.addColumn(this.columns, column).addRow(this.rows, row);
}

export default Matrix;