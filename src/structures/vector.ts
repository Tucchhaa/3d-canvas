import Matrix from "./matrix";

export class Vector3 {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) { }
    
    // ===
    public sqrMagnitude() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public magnitude(): number {
        return Math.sqrt(this.sqrMagnitude());
    }

    public setMagnitude(magnitude: number): Vector3 {
        const coefficient = magnitude / this.magnitude();

        this.multiply(coefficient);

        return this;
    }

    /**
     * 
     * @returns unit vector
     */
    public unit() {
        const magnitude = this.magnitude();

        return Vector3.divide(this, magnitude);
    }

    // ===
    // Simple vectors
    // ===
    public static get zero() {
        return new Vector3(0, 0, 0);
    }

    public static get one() {
        return new Vector3(1, 1, 1);
    }

    // ===
    public static get up() {
        return new Vector3(0, 1, 0);
    }

    public static get down() {
        return new Vector3(0, -1, 0);
    }

    public static get forward() {
        return new Vector3(0, 0, 1);
    }

    public static get backward() {
        return new Vector3(0, 0, -1);
    }

    // if look along Z axis, your right side will be on the negative x
    public static get right() {
        return new Vector3(-1, 0, 0);
    }

    public static get left() {
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
    public rotate(direction: Vector3, angle: number) {
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
        matrix.set(3, 0, -this.y);
        matrix.set(3, 0, -this.z);

        return matrix;
    }

    getTranlationFromOriginMatrix(): Matrix {
        const matrix = Matrix.identity(4, 4);
    
        matrix.set(3, 0, this.x);
        matrix.set(3, 0, this.y);
        matrix.set(3, 0, this.z);

        return matrix;
    }

    public asColumnVector(): Matrix {
        return new Matrix([[this.x], [this.y], [this.z]]);
    }

    public asRowVector(): Matrix {
        return new Matrix([[this.x, this.y, this.z]]);
    }

    public static fromMatrix(matrix: Matrix) {
        if(!matrix.isVector()) {
            throw new Error();
        }

        return Vector3.fromArray(matrix.to1DArray());
    }

    public static fromArray(array: number[]) {
        return new Vector3(array[0], array[1], array[2]);
    }

    // ===
    // Data convertations
    // ===
    public asArray() {
        return [this.x, this.y, this.z];
    }

    public asVector2() {
        return new Vector2(this.x, this.y);
    }

    public set(vector: Vector3) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }

    // ===
    // Mutable arithmetic
    // ===
    public add(a: Vector3): Vector3 {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;

        return this;
    }

    public substract(a: Vector3): Vector3 {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;

        return this;
    }

    public multiply(a: Vector3): Vector3;
    public multiply(scalar: number): Vector3
    public multiply(a: Vector3 | number): Vector3 {
        if(a instanceof Vector3) {
            this.x *= a.x;
            this.y *= a.y;
            this.z *= a.z;
        }
        else {
            this.x *= a;
            this.y *= a;
            this.z *= a;
        }

        return this;
    }

    public divide(scalar: number): Vector3 {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;

        return this;
    }

    // ===
    // Immutable arithmetic 
    // ===
    public static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public static multiply(a: Vector3, scalar: number): Vector3;
    public static multiply(a: Vector3, b: Vector3): Vector3;
    public static multiply(a: Vector3, b: Vector3 | number): Vector3 {
        // console.log(a, b);
        if(b instanceof Vector3)
            return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);

        return new Vector3(a.x * b, a.y * b, a.z * b);
    }

    public static substract(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public static divide(a: Vector3, scalar: number): Vector3;
    public static divide(a: Vector3, b: Vector3): Vector3;
    public static divide(a: Vector3, b: Vector3 | number): Vector3 {
        if(b instanceof Vector3)
            return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);

        return new Vector3(a.x / b, a.y / b, a.z / b);
    }

    // ===
    // Vector multiplication
    // ===
    public static dot(a: Vector3, b: Vector3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public static cross(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            a.y * b.z - a.z * b.y,
            a.x * b.z - a.z * b.x,
            a.x * b.y - a.y * b.x
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
    public static getAngleBetween(a: Vector3, b: Vector3): number {
        const dotProduct = Vector3.dot(a, b);

        if(dotProduct >= 1)
            return 0;

        if(dotProduct <= -1)
            return Math.PI

        return Math.acos(dotProduct);
    }

    public static calculateRotationMatrix(direction: Vector3, angle: number): Matrix {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const Q = Matrix.identity(3, 3).mul(cos);

        const d = direction;

        const m = direction.asColumnVector().mmul(direction.asRowVector()).mul(1 - cos);
        const n  = new Matrix([[0, d.z, -d.y], [-d.z, 0, d.x], [d.y, -d.x, 0]]).mul(sin);

        for(let i=0; i < 3; i++) {
            for(let j=0; j < 3; j++) {
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
    ) { }


    // ===
    // Mutable arithmetic
    // ===
    public add(scalar: number): Vector2;
    public add(a: Vector2): Vector2;
    public add(a: Vector2 | number): Vector2 {
        if(a instanceof Vector2) {
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
    public multiply(a: Vector2): Vector2;
    public multiply(scalar: number): Vector2
    public multiply(a: Vector2 | number): Vector2 {
        if(a instanceof Vector2) {
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
    public static get zero() {
        return new Vector2(0, 0);
    }

    public static get one() {
        return new Vector2(1, 1);
    }
}
