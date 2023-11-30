import { Vector3 } from '../structures/vector';

/**
 * Represents an object in the 3D space that has a position and a direction
 */
export abstract class SpaceEntity {
	/**
	 * World coordinates
	 */
	#position: Vector3 = Vector3.zero;
	/**
	 * Unit vector which represents a direction at which object looks forward
	 */
	#direction: Vector3 = Vector3.forward;

	get position() {
		return this.#position;
	}

	setPosition(position: Vector3) {
		this.#position = position;
	}

	get direction() {
		return this.#direction;
	}

	setDirection(direction: Vector3) {
		this.#direction = direction;
	}

	/**
	 * Rotates object according to right hand rule
	 * @param direction normal vector
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3, angle: number): void {
		this.#direction.rotate(direction, angle);
	}

	/**
	 * Translates object relative to its direction
	 */
	translate(delta: Vector3): void {
		const angle = Vector3.getAngleBetween(this.direction, Vector3.forward);
		const cross = Vector3.cross(this.direction, Vector3.forward);
		const normal = cross.unit();

		if (cross.sqrMagnitude() !== 0) {
			delta.rotate(normal, angle);
		} else if (angle == Math.PI) {
			delta.multiply(-1);
		}

		// console.log('normal: ', normal, ']\nangle: ', angle * 180/Math.PI, '\ndelta: ', delta, '\nposition: ', this.position);

		this.setPosition(Vector3.add(this.position, delta));
	}
}
