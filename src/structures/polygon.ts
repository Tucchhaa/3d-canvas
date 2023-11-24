import { Vector3 } from "./vector";

export class Polygon {
    /**
     * Should contain only 3 verteces
     */
    public readonly verteces: Vector3[];

    constructor(
        public readonly v1: Vector3,
        public readonly v2: Vector3,
        public readonly v3: Vector3
    ) {
        this.verteces = [v1, v2, v3];
    }
}
