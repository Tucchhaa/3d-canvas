import Matrix from "structures/matrix";
import { Vector3 } from "structures/vector";
import { Polygon } from "structures/polygon";
import { SpaceEntity } from "./space_entity";

export type ObjectName = 'cube';

export class Object3D extends SpaceEntity {
    public readonly polygons: Polygon[];

    public setPosition(value: Vector3) {
        const translationVector = Vector3.substract(value, this.position);
        
        for(const polygon of this.polygons) {
            for(const vertex of polygon.vertexes) {
                vertex.add(translationVector);
            }
        }

        super.setPosition(value);
    }

    private _scale: Vector3 = Vector3.one;

    public get scale() {
        return this._scale;
    }

    public setScale(value: Vector3) {
        const translate = this.position.getTranslationToOriginMatrix();
        const translateBack = this.position.getTranslationFromOriginMatrix();

        const scaleRatio = Vector3.divide(value, this._scale);
        const scaleMatrix = Matrix.diag(scaleRatio.asArray()).asHomogeneous();

        const applyMatrix = translate.mmul(scaleMatrix).mmul(translateBack);
        
        for(const polygon of this.polygons) {
            for(const vertex of polygon.vertexes) {
                const vector = vertex.asRowVector().asHomogeneous();

                const result = vector.mmul(applyMatrix);

                vertex.set(Vector3.fromMatrix(result));
            }
        }

        this._scale = value;
    }

    /**
     * 
     * @param direction rotation direction
     * @param angle angle in radians
     */
    public rotate(direction: Vector3, angle: number) {
        super.rotate(direction, angle);

        const rotation = Vector3.calculateRotationMatrix(direction, angle).asHomogeneous();
        const translateTo = this.position.getTranslationToOriginMatrix();
        const translateFrom = this.position.getTranslationFromOriginMatrix();

        const matrix = translateTo.mmul(rotation).mmul(translateFrom);

        for(const polygon of this.polygons) {
            for(const vertex of polygon.vertexes) {
                const rotatedVertex = vertex.asRowVector().asHomogeneous().mmul(matrix);

                vertex.set(Vector3.fromMatrix(rotatedVertex));
            }
        }
    }

    constructor(polygons: Polygon[], position: Vector3 = Vector3.zero, scale: Vector3 = Vector3.one, direction: Vector3 = Vector3.forward) {
        super();
        
        this.polygons = polygons;
        this.setScale(scale);
        this.setPosition(position);
    }
}

export class Cube extends Object3D {
    constructor(position: Vector3 = Vector3.zero, scale: Vector3 = Vector3.one, direction: Vector3 = Vector3.forward) {
        const polygons = [
            // left
            new Polygon(
                new Vector3(-0.5, -0.5, +0.5),
                new Vector3(-0.5, +0.5, +0.5),
                new Vector3(-0.5, -0.5, -0.5),
            ),
            new Polygon(
                new Vector3(-0.5, +0.5, -0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(-0.5, +0.5, +0.5),
            ),

            // front
            new Polygon(
                new Vector3(-0.5, -0.5, +0.5),
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(+0.5, +0.5, +0.5),
            ),
            new Polygon(
                new Vector3(-0.5, -0.5, +0.5),
                new Vector3(+0.5, +0.5, +0.5),
                new Vector3(-0.5, +0.5, +0.5),
            ),

            // right
            new Polygon(
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(+0.5, +0.5, -0.5),
            ),
            new Polygon(
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(+0.5, +0.5, -0.5),
                new Vector3(+0.5, +0.5, +0.5),
            ),

            // back
            new Polygon(
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(-0.5, +0.5, -0.5),
            ),
            new Polygon(
                new Vector3(+0.5, +0.5, -0.5),
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(-0.5, +0.5, -0.5),
            ),

            // bottom
            new Polygon(
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(-0.5, -0.5, +0.5),
            ),
            new Polygon(
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, +0.5),
            ),

            // top
            new Polygon(
                new Vector3(-0.5, +0.5, -0.5),
                new Vector3(-0.5, +0.5, +0.5),
                new Vector3(+0.5, +0.5, +0.5),
            ),
            new Polygon(
                new Vector3(-0.5, +0.5, -0.5),
                new Vector3(+0.5, +0.5, +0.5),
                new Vector3(+0.5, +0.5, -0.5),
            ),
        ];

        super(polygons, position, scale, direction);
    }
}

export class Pyramid extends Object3D {
    constructor(position: Vector3 = Vector3.zero, scale: Vector3 = Vector3.one, direction: Vector3 = Vector3.forward) {
        const polygons = [
            // left
            new Polygon(
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(-0.5, -0.5, +0.5),
                new Vector3(0, 0.5, +0),
            ),

            // front
            new Polygon(
                new Vector3(-0.5, -0.5, +0.5),
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(0, 0.5, +0),
            ),

            // right
            new Polygon(
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(0, 0.5, +0),
            ),

            // back
            new Polygon(
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(0, 0.5, +0),
            ),

            // bottom
            new Polygon(
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, +0.5),
                new Vector3(-0.5, -0.5, +0.5),
            ),
            new Polygon(
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, -0.5),
                new Vector3(+0.5, -0.5, +0.5),
            ),
        ];

        super(polygons, position, scale, direction);
    }
}

