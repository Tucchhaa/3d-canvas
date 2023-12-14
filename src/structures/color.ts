export class Color {
    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a: number = 1.0
    ) {}

    mix(add: Color, ratio: number) {
        const alpha = 1 - (1 - add.a) * (1 - this.a);

        this.r = Math.round((add.r * add.a / alpha) + (this.r * this.a * (1 - add.a) / alpha)) * ratio;
        this.g = Math.round((add.g * add.a / alpha) + (this.g * this.a * (1 - add.a) / alpha)) * ratio;
        this.b = Math.round((add.b * add.a / alpha) + (this.b * this.a * (1 - add.a) / alpha)) * ratio;
        this.a = alpha;

        return this;
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}