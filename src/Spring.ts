import { Player } from "./SpringManager";
import { PI } from "./utils/math";
import Vector from "./Vector";

export interface SpringConstructorProps {
    staticPosition?: Vector;

    readonly k: number;
    readonly mass: number;
    readonly damp: number;
    readonly ctx: CanvasRenderingContext2D;
    readonly width: number;
    readonly height: number;
    readonly stretchedLength: number;
    readonly springRadius: number;
}

class Spring extends Player {
    private acc: Vector = new Vector({ x: 0, y: 0 });
    private vel: Vector = new Vector({ x: 0, y: 0 });

    private stretchedLength: number;
    private springRadius: number;

    private staticPosition: Vector;
    public activePosition: Vector;
    private gravity: Vector = new Vector({
        x: 0,
        y: 1,
    });

    private mass: number;
    private k: number;
    private damp: number;

    readonly ctx: CanvasRenderingContext2D;
    readonly width: number;
    readonly height: number;

    constructor({
        staticPosition,
        mass,
        k,
        damp,
        stretchedLength,
        springRadius,
        ctx,
        height,
        width,
    }: SpringConstructorProps) {
        super({
            playfunction: (staticPosition?: Vector) =>
                this.renderSpring(staticPosition),
        });

        this.ctx = ctx;
        this.height = height;
        this.width = width;

        this.k = k;
        this.mass = mass;
        this.damp = damp;
        this.stretchedLength = stretchedLength;
        this.springRadius = springRadius;

        this.staticPosition =
            staticPosition ??
            new Vector({
                x: width / 2,
                y: height / 2,
            });

        this.activePosition = new Vector({
            x: width / 2,
            y: height / 2 + this.stretchedLength,
        });
    }

    private updateAcc(activePosition: Vector, staticPosition: Vector): Vector {
        //* 기존 길이보다 늘어난 경우를 기본으로 하여 벡터 생성
        const springVector = staticPosition.subtract(activePosition);
        const springStrechedLength = springVector.magnitude();
        const springDelta = Math.abs(springStrechedLength - this.stretchedLength);

        //* spring force, 복원력의 방향 설정
        //* F = (-)K*Δx -> 움직임을 저항하는 의미, -
        const springForceDirection =
            springStrechedLength > this.stretchedLength
                ? springVector
                : springVector.multiple(-1);

        //* F = (-)K*Δx
        const springForceVector = springForceDirection
            .normalize()
            .multiple(this.k * springDelta);

        const gravitionalForceVector = this.gravity.multiple(this.mass);

        //* damping force = 저항력, -1을 곱해야 한다
        const dampingForceVector = this.vel.multiple(-1 * this.damp);

        const resultantForceVector = gravitionalForceVector
            .add(springForceVector)
            .add(dampingForceVector);
        return resultantForceVector.multiple(1 / this.mass);
    }
    private updateVel(currentVelocity: Vector, calcedAcc: Vector): Vector {
        //* damping 0 to 1 value
        return currentVelocity.add(calcedAcc);
    }

    private updateActivePos(currentPosition: Vector, updatedVel: Vector): Vector {
        return currentPosition.add(updatedVel);
    }

    private updatePhysicalProperty(staticPosition?: Vector) {
        const updatedAcc = this.updateAcc(
            this.activePosition,
            staticPosition ?? this.staticPosition
        );
        this.acc = updatedAcc;

        const updatedVel = this.updateVel(this.vel, updatedAcc);
        this.vel = updatedVel;

        //* 전의 위치를 저장 후 업데이트
        this.activePosition = this.updateActivePos(this.activePosition, updatedVel);
    }

    private renderSpring(staticPosition?: Vector) {
        //* 가속도가 0에 근접-> 계산할 필요 없는 정적평형상태
        this.updatePhysicalProperty(staticPosition);

        this.ctx.beginPath();

        this.ctx.arc(
            this.activePosition.x,
            this.activePosition.y,
            this.springRadius,
            0,
            2 * PI
        );
        this.ctx.fillStyle = "#000000";

        const accMagnitude = this.acc.magnitude();
        this.ctx.lineWidth = accMagnitude > 5 ? 5 + 1 : accMagnitude + 1;
        this.ctx.fill();

        this.ctx.moveTo(
            staticPosition?.x ?? this.staticPosition.x,
            staticPosition?.y ?? this.staticPosition.y
        );
        this.ctx.lineTo(this.activePosition.x, this.activePosition.y);
        this.ctx.stroke();
        this.ctx.strokeStyle = "#000000";

        this.ctx.closePath();
    }
}

export default Spring;
