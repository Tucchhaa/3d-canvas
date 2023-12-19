import { Color } from '../structures/color';
import { Polygon } from '../structures/geometry';
import { Vector3 } from '../structures/vector';
import { SpaceEntity } from './space_entity';

export type LightConfig = {
	color: Color;
	intensity: number;

	layers: string[];

	pivot: Vector3;
	position: Vector3;
};

export abstract class LightSource extends SpaceEntity {
	intensity: number = 1;

	color: Color;

	layers: string[];

	constructor(options: Partial<LightConfig>) {
		super(options.pivot ?? Vector3.zero);

		this.color = options.color ?? new Color(255, 255, 255, 1);
		this.intensity = options.intensity ?? 1;
		this.layers = options.layers ?? [];

		this.setPosition(options.position ?? Vector3.zero);
	}

	abstract applyLight(polygon: Polygon, normal: Vector3, color: Color): void;

	protected mixLightColor(color: Color, coefficient: number): void {
		color.r = color.r + this.color.r * this.color.a * coefficient * this.intensity;
		color.g = color.g + this.color.g * this.color.a * coefficient * this.intensity;
		color.b = color.b + this.color.b * this.color.a * coefficient * this.intensity;
	}
}

export class DirectLight extends LightSource {
	constructor(options: Partial<LightConfig & { direction: Vector3 }>) {
		super(options);

		this.setDirection(options.direction ?? Vector3.forward);
	}

	applyLight(polygon: Polygon, normal: Vector3, color: Color) {
		const dot = -Vector3.dot(normal, this.direction);

		if (dot > 0) {
			this.mixLightColor(color, dot);
		}
	}
}

export class SpotLight extends LightSource {
	radius: number;

	constructor(options: Partial<LightConfig & { radius?: number }>) {
		super(options);

		this.radius = options.radius ?? 500;
	}

	applyLight(polygon: Polygon, normal: Vector3, color: Color) {
		const position = polygon.vertexes.reduce((pos, vertex) => pos.add(vertex), Vector3.zero);
		position.multiply(1 / polygon.vertexes.length);

		const vector = Vector3.subtract(position, this.position).unit();
		const dot = -Vector3.dot(normal, vector);
		const distanceCoefficient = 1 - vector.sqrMagnitude / (this.radius * this.radius);

		if (dot > 0 && distanceCoefficient > 0) {
			this.mixLightColor(color, dot * distanceCoefficient);
		}
	}
}
