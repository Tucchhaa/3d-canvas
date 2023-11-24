// class Vector {
//     constructor(
//         public x: number,
//         public y: number,
//         public z: number
//     ) {

//     }

//     public scaleTo(scale: number): void {
//         this.x = this.x * scale;
//         this.y = this.y * scale;
//         this.z = this.z * scale;
//     }

//     public magnitude(): number {
//         return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
//     }

//     public unit() {
//         const magnitude = this.magnitude();

//         return new Vector(this.x / magnitude, this.y / magnitude, this.z / magnitude);
//     }

//     public rotate(Q: number[][]) {
//         const { x, y, z } = this;

//         this.x = x * Q[0][0] + y * Q[1][0] + z * Q[2][0];
//         this.y = x * Q[0][1] + y * Q[1][1] + z * Q[2][1];
//         this.z = x * Q[0][2] + y * Q[1][2] + z * Q[2][2];
//     }

//     public static add(a: Vector, b: Vector) {
//         return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
//     }
// }

// class Vector2D {
//     constructor(
//         public x: number,
//         public y: number,
//     ) {}

//     public static from3D(vector3d: Vector) {
//         return new Vector2D(vector3d.x, vector3d.y);
//     }
// }

// class Face {
//     constructor(
//         public readonly v1: Vector,
//         public readonly v2: Vector,
//         public readonly v3: Vector
//     ) {}

//     public asArray() {
//         return [this.v1, this.v2, this.v3];
//     }

//     public scale(scale: number): void {
//         this.v1.scaleTo(scale);
//         this.v2.scaleTo(scale);
//         this.v3.scaleTo(scale);
//     }

//     public rotate(Q: number[][]) {
//         this.v1.rotate(Q);
//         this.v2.rotate(Q);
//         this.v3.rotate(Q);
//     }
// }

// class Shape {
//     constructor(public position: Vector, public readonly faces: Face[]) { }

//     public scale(scale: number) {
//         for(const face of this.faces) {
//             face.scale(scale);
//         }
//     }

//     public rotate(direction: Vector, angle: number) {
//         const cos = Math.cos(angle);
//         const sin = Math.sin(angle);

//         const Q = [[cos, 0, 0], [0, cos, 0], [0, 0, cos]];

//         const d = direction;

//         const m = [[d.x*d.x, d.x*d.y, d.x*d.z], [d.x*d.y, d.y*d.y, d.y*d.z], [d.x*d.z, d.y*d.z, d.z*d.z]];
//         const n = [[0, d.z, -d.y], [-d.z, 0, d.x], [d.y, -d.x, 0]];

//         for(let i=0; i < 3; i++) {
//             for(let j=0; j < 3; j++) {
//                 Q[i][j] = Q[i][j] + (1 - cos) * m[i][j] - sin * n[i][j];
//             }
//         }

//         for(const face of this.faces) {
//             face.rotate(Q);
//         }
//     }
// }

// class Cube extends Shape {
//     constructor(position: Vector, scale: number) {
//         const faces = [
//             // 1
//             new Face(
//                 new Vector(-0.5, -0.5, +0.5),
//                 new Vector(-0.5, -0.5, -0.5),
//                 new Vector(-0.5, +0.5, +0.5),
//             ),
//             new Face(
//                 new Vector(-0.5, +0.5, -0.5),
//                 new Vector(-0.5, -0.5, -0.5),
//                 new Vector(-0.5, +0.5, +0.5),
//             ),

//             // 2
//             new Face(
//                 new Vector(-0.5, -0.5, +0.5),
//                 new Vector(+0.5, -0.5, +0.5),
//                 new Vector(+0.5, +0.5, +0.5),
//             ),
//             new Face(
//                 new Vector(-0.5, -0.5, +0.5),
//                 new Vector(-0.5, +0.5, +0.5),
//                 new Vector(+0.5, +0.5, +0.5),
//             ),

//             // 3
//             new Face(
//                 new Vector(+0.5, -0.5, +0.5),
//                 new Vector(+0.5, -0.5, -0.5),
//                 new Vector(+0.5, +0.5, -0.5),
//             ),
//             new Face(
//                 new Vector(+0.5, -0.5, +0.5),
//                 new Vector(+0.5, +0.5, +0.5),
//                 new Vector(+0.5, +0.5, -0.5),
//             ),

//             // 4
//             new Face(
//                 new Vector(+0.5, -0.5, -0.5),
//                 new Vector(-0.5, -0.5, -0.5),
//                 new Vector(-0.5, +0.5, -0.5),
//             ),
//             new Face(
//                 new Vector(+0.5, -0.5, -0.5),
//                 new Vector(+0.5, +0.5, -0.5),
//                 new Vector(-0.5, +0.5, -0.5),
//             ),

//             // 5
//             new Face(
//                 new Vector(-0.5, -0.5, -0.5),
//                 new Vector(-0.5, -0.5, +0.5),
//                 new Vector(+0.5, -0.5, +0.5),
//             ),
//             new Face(
//                 new Vector(-0.5, -0.5, -0.5),
//                 new Vector(+0.5, -0.5, -0.5),
//                 new Vector(+0.5, -0.5, +0.5),
//             ),

//             // 6
//             new Face(
//                 new Vector(-0.5, +0.5, -0.5),
//                 new Vector(-0.5, +0.5, +0.5),
//                 new Vector(+0.5, +0.5, +0.5),
//             ),
//             new Face(
//                 new Vector(-0.5, +0.5, -0.5),
//                 new Vector(+0.5, +0.5, -0.5),
//                 new Vector(+0.5, +0.5, +0.5),
//             ),
//         ];

//         super(position, faces);

//         this.scale(scale);
//     }
// }

// const D = 550;
// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// canvas.width = canvas.offsetWidth;
// canvas.height = canvas.offsetHeight;

// const CENTER_X = canvas.width / 2;
// const CENTER_Y = canvas.height / 2;

// const ctx = canvas.getContext("2d")!;
// ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
// ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

// // const cube = new Cube(new Vector(CENTER_X, CENTER_Y, 0), 300);
// const cube = new Cube(new Vector(0, 11*CENTER_Y/10, 0), 300);
// const objects = [cube];

// let angularVelocity = 0.005;


// render(ctx, objects);
// setInterval(() => {
//     cube.rotate(new Vector(1, 1, 1).unit(), angularVelocity);

//     render(ctx, objects);
// }, 1000/60);


// function render(ctx: CanvasRenderingContext2D, objects: Shape[]) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     for(const shape of objects) {
//         for(const face of shape.faces) {
//             drawFace(ctx, shape.position, face);
//         }
//     }
// }

// function drawFace(ctx: CanvasRenderingContext2D, position: Vector, face: Face) {
//     const verteces = face.asArray();
//     let isFirst = false;

//     ctx.beginPath();

//     for(const v of verteces) {
//         const vertex = Vector.add(v, position);
//         const projection = project(vertex);

//         isFirst 
//             ? ctx.moveTo(projection.x + CENTER_X, projection.y + CENTER_Y)
//             : ctx.lineTo(projection.x + CENTER_X, projection.y + CENTER_Y);

//         isFirst = false;
//     }

//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
// }

// function project(vector: Vector) {
//     // return Vector2D.from3D(vector);

//     const r = D / vector.y;
//     const result = new Vector2D(vector.x * r, vector.z * r);

//     return result;
// }
