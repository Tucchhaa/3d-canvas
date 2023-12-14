import { Color } from '../structures/color';
import { Vector3 } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type LightConfig = {
	color: Color;
	intensity: number;

	pivot: Vector3;
	position: Vector3;
};

export abstract class LightSource extends SpaceEntity {
	intensity: number = 1;

	color: Color;

	constructor(options: Partial<LightConfig>) {
		super(options.pivot ?? Vector3.zero);

		this.color = options.color ?? new Color(255, 255, 255, 1);
		this.intensity = options.intensity ?? 1;

		this.setPosition(options.position ?? Vector3.zero);
	}

	abstract applyLight(normal: Vector3, color: Color): void;
}

export class SpotLight {}

export class DirectLight extends LightSource {
	constructor(options: Partial<LightConfig & { direction: Vector3 }>) {
		super(options);

		this.setDirection(options.direction ?? Vector3.forward);
	}

	applyLight(normal: Vector3, color: Color) {
		const dot = -Vector3.dot(normal, this.direction);

		if (dot > 0) {
			color.r = color.r + this.color.r * this.color.a * dot * this.intensity;
			color.g = color.g + this.color.g * this.color.a * dot * this.intensity;
			color.b = color.b + this.color.b * this.color.a * dot * this.intensity;
		}
	}
}
