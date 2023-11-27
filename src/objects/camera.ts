import Matrix from "ml-matrix";
import { Vector2, Vector3 } from "structures/vector";
import { SpaceEntity } from "./space_entity";

export type CameraConfig = {
    fov?: number, 
    near?: number,
    far?: number,
};

export class Camera extends SpaceEntity {
    /**
     * Field view in radians
     */
    private scale!: number;

    private _fov!: number;

    public get fov() {
        return this._fov;
    }
    public set fov(value: number) {
        this._fov = value;
        this.scale = 1 / Math.tan(this.fov / 2);
    }

    public near: number;

    public far: number;

    // ===

    private projectionMatrix!: Matrix;
    private perspectiveMatrix!: Matrix;

    // ===

    constructor(config: CameraConfig = {}, position: Vector3 = Vector3.zero, direction: Vector3 = Vector3.backward) {
        super();

        this.setPosition(position);
        this.setDirection(direction);

        const { fov, near, far } = config;

        this.fov = fov ?? Math.PI / 3;
        this.near = near ?? 0.01;
        this.far = far ?? 5000;

        this.initProjectionMatrix();
        this.preparePerspectiveMatrix();
    }

    // ===
    // Projection and perspective
    // ===

    public project(vertex: Vector3) {
        const vectorFromCamera = Vector3.substract(vertex, this.position);
        // const forw = new Vector3(0, this.direction.y, this.direction.z).unit();

        const angle = Vector3.getAngleBetween(Vector3.forward, this.direction);
        const cross = Vector3.cross(Vector3.forward, this.direction);

        const normal = cross.unit();
        // console.log('before: ', vectorFromCamera);
        if(cross.sqrMagnitude() !== 0) {
            vectorFromCamera.rotate(normal, angle);    
        } 
        else if(angle == Math.PI) {
            vectorFromCamera.z = -vectorFromCamera.z;
            vectorFromCamera.x = -vectorFromCamera.x;
            // vectorFromCamera.y = -vectorFromCamera.y;

            // vectorFromCamera.multiply(-1);
        }

        // console.log('normal: ', normal, '\nangle:', angle * 180/Math.PI, '\nvector: ', vectorFromCamera);

        const projectionMatrix = this.calculateProjectionMatrix(vectorFromCamera.z);

        const homogeneousVector = vectorFromCamera.asRowVector().asHomogeneous();

        const projectionVector = homogeneousVector.mmul(projectionMatrix).mmul(this.perspectiveMatrix);

        const point = Vector3.fromMatrix(projectionVector);

        if(point.z < this.near || point.z > this.far) {
            point.multiply(new Vector3(point.z, point.z, 1));
        }

        return point;
    }

    public isProjectedPointInViewport(point: Vector3) {
        return (
            point.z >= this.near && point.z <= this.far
            && point.x > - 1 && point.x < 1
            && point.y > - 1 && point.y < 1
        );
    }

    private initProjectionMatrix(): void {
        this.projectionMatrix = Matrix.diagonal([0, 0, 1], 4, 4);
        this.projectionMatrix.set(2, 3, 1);
    }

    private calculateProjectionMatrix(z: number): Matrix {
        /*
        W = -z
        projectionMatrix = 
            1/W  0     0   0
            0    1/W  0   0
            0    0     -1  -1
            0    0     0   0
        */
        this.projectionMatrix.set(0, 0, -1/z);
        this.projectionMatrix.set(1, 1, -1/z);

        return this.projectionMatrix;
    }

    private preparePerspectiveMatrix() {
        const { far, near, scale } = this;

        /*
        perspectiveMatrix = 
            scale  0      0         0
            0      scale  0         0
            0      0      f/(f-n)  1
            0      0      f*n(f-n) 0
        */
        const perspectiveMatrix = Matrix.diagonal([scale, scale], 4, 4);
        perspectiveMatrix.set(2, 2, far / (far - near));
        perspectiveMatrix.set(3, 2, far * near / (far - near));
        perspectiveMatrix.set(2, 3, 1);

        this.perspectiveMatrix = perspectiveMatrix;
    }
}
