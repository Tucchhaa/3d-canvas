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
	constructor(pivot: Vector3 = Vector3.zero) {
		this.pivot = pivot;
	}

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

	setDirection(direction: Vector3) {
		const angle = Vector3.getAngleBetween(this.#direction, direction);
		const normal = Vector3.cross(this.#direction, direction);

		this.rotate(normal, angle);
	}

	get rotation() {
		return this.#rotation;
	}

	/**
	 * Rotates object according to right hand rule
	 * @param normal normal vector
	 * @param angle angle in radians
	 */
	rotate(normal: Vector3, angle: number) {
		const rotationMatrix = Vector3.calculateRotationMatrix(normal, angle);

		this.#rotation = this.#rotation.mmul(rotationMatrix);
		this.#direction.mmul(rotationMatrix);
	}

	/**
	 * Translates object relative to its direction
	 */
	translateX(delta: Vector3) {
		this.#translate(delta, 'x');
	}

	translateZ(delta: Vector3) {
		this.#translate(delta, 'z');
	}

	#translate(delta: Vector3, direction: 'x' | 'z') {
		let theta = Math.atan(this.#direction.x / this.#direction.z);
		// make angle always positive
		if (theta < 0) {
			theta = theta * -1;
		}
		if (direction === 'x') {
			const direction = this.#direction.clone();
			if (!direction.x) {
				direction.x = 1;
			}
			delta.x = delta.x * Math.cos(theta) * (direction.x > 0 ? 1 : -1);
			delta.z = delta.x * Math.sin(theta);
			this.#position.add(Vector3.multiply(delta, direction));
		} else if (direction === 'z') {
			delta.x = delta.z * Math.sin(theta);
			delta.z = -delta.z * Math.cos(theta);
			this.#position.add(Vector3.multiply(delta, this.#direction));
		}
	}
}
