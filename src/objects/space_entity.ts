import { Matrix } from '../structures/matrix';
import { Vector3 } from '../structures/vector';

/**
 * Represents an object in the 3D space that has a position and a direction
 */
export abstract class SpaceEntity {
	/**
	 * Name for debugging
	 */
	name: string = 'entity';

	/**
	 * World coordinates
	 */
	#position: Vector3 = Vector3.zero;

	/**
	 * Center point of the object. Rotation occurs around it.
	 */
	readonly pivot: Vector3 = Vector3.zero;

	/**
	 * Unit vector which represents a direction at which object looks forward
	 */
	#direction: Vector3 = Vector3.forward;

	/**
	 * If multiply Vector3.forward by this matrix, we will get the direction of the camera
	 */
	#rotation: Matrix = Matrix.identity(3, 3);

	// ===

	get position() {
		return this.#position;
	}

	setPosition(position: Vector3) {
		this.#position = Vector3.add(position, this.pivot);
	}

	get direction() {
		return this.#direction;
	}

	get rotation() {
		return this.#rotation;
	}

	// ===
	constructor(pivot: Vector3 = Vector3.zero) {
		this.pivot = pivot;
	}

	/**
	 * Rotates object according to right hand rule
	 * @param normal normal vector
	 * @param angle angle in radians
	 */
	rotate(normal: Vector3, angle: number) {
		const rotationMatrix = Vector3.calculateRotationMatrix(normal, angle);

		this.#rotation = this.rotation.mmul(rotationMatrix);
		this.#direction.mmul(rotationMatrix);
	}

	/**
	 * Translates object relative to its direction
	 */
	translate(delta: Vector3): void {
		throw new Error('not implemented');
	}
}
