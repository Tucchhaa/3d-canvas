import { Vector3D } from '../structures/vector';

/**
 * Represents an object in the 3D space that has a position and a direction
 */
export abstract class SpaceEntity {
	/**
	 * World coordinates
	 */
	#position: Vector3D = Vector3D.zero;
	/**
	 * Unit vector which represents a direction at which object looks forward
	 */
	#direction: Vector3D = Vector3D.forward;

	get position() {
		return this.#position;
	}

	setPosition(position: Vector3D) {
		this.#position = position;
	}

	get direction() {
		return this.#direction;
	}

	setDirection(direction: Vector3D) {
		this.#direction = direction;
	}

	/**
	 * Rotates object according to right hand rule
	 * @param direction normal vector
	 * @param angle angle in radians
	 */
	rotate(direction: Vector3D, angle: number): void {
		this.#direction.rotate(direction, angle);
	}

	/**
	 * Translates object relative to its direction
	 */
	translate(delta: Vector3D): void {
		const angle = Vector3D.getAngleBetween(this.direction, Vector3D.forward);
		const cross = Vector3D.cross(this.direction, Vector3D.forward);
		const normal = cross.unit();

		if (cross.sqrMagnitude() !== 0) {
			delta.rotate(normal, angle);
		} else if (angle == Math.PI) {
			delta.multiply(-1);
		}

		// console.log('normal: ', normal, ']\nangle: ', angle * 180/Math.PI, '\ndelta: ', delta, '\nposition: ', this.position);

		this.setPosition(Vector3D.add(this.position, delta));
	}
}
