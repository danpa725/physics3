import { multiple, sqrt } from "./utils/math";

interface VectorConstructorProps {
    x: number;
    y: number;
}

class Vector {
    public x: number;
    public y: number;
    constructor({ x, y }: { x: number; y: number }) {
        this.x = x;
        this.y = y;
    }

    public add({ x: addX, y: addY }: VectorConstructorProps) {
        //* 새로운 벡터를 생성하여 참조 객체의 값을 직접 업데이트 하지 않음
        return new Vector({
            x: this.x + addX,
            y: this.y + addY,
        });
    }

    /**
     * @note `vecA`.substract(`vecB`) -> vec `BA`
     */
    public subtract({ x: subX, y: subY }: VectorConstructorProps) {
        return new Vector({
            x: this.x - subX,
            y: this.y - subY,
        });
    }

    public multiple(multScalar: number) {
        return new Vector({
            x: this.x * multScalar,
            y: this.y * multScalar,
        });
    }

    public divide(divScalar: number) {
        if (Math.round(divScalar) === 0) throw Error("divide by 0");
        return new Vector({
            x: this.x / divScalar,
            y: this.y / divScalar,
        });
    }

    public _add({ x: addX, y: addY }: VectorConstructorProps) {
        //* 객체의 값을 직접 업데이트
        this.x += addX;
        this.y += addY;
        return this;
    }

    /**
     * @note `vecA`.substract(`vecB`) -> vec `BA`
     */
    public _subtract({ x: subX, y: subY }: VectorConstructorProps) {
        this.x -= subX;
        this.y -= subY;
        return this;
    }

    public _multiple(multScalar: number) {
        this.x *= multScalar;
        this.y *= multScalar;
        return this;
    }

    public _divide(divScalar: number) {
        if (Math.round(divScalar) === 0) throw Error("divide by 0");
        this.x /= divScalar;
        this.y /= divScalar;
        return this;
    }

    public magnitude() {
        return sqrt(multiple(this.x) + multiple(this.y));
    }

    public normalize() {
        const vectorLength = this.magnitude();
        if (vectorLength === 0) throw Error("magnitude = 0");
        return this.divide(vectorLength);
    }
}

export default Vector;
