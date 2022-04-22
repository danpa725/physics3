import { Canvas, CanvasConstructorProps } from "./Canvas";
import Spring, { SpringConstructorProps } from "./Spring";
import Vector from "./Vector";

interface SpringPlayerConstructorProp {
    playfunction: (staticPosition: Vector) => void;
}
class Player {
    protected playFunction;
    constructor({ playfunction }: SpringPlayerConstructorProp) {
        this.playFunction = playfunction;
    }

    public play = (staticPosition: Vector) => {
        this.playFunction(staticPosition);
    };
}

interface SpringType {
    new ({ ctx, width, height, damp, k, mass }: SpringConstructorProps): Spring;
}

interface ManagerConstructorProps<ConstructorOption> extends CanvasConstructorProps {
    Spring: SpringType;
    springNumber: number;
    springDampArray: number[];
    springKArray: number[];
    springMassArray: number[];
    springStretchedLengthArray: number[];
    springRadiusArray: number[];
    constructorOption?: ConstructorOption;
}

class SpringManager<ConstructorOption> {
    private canvasApp: Canvas;

    protected springNumber: number;
    protected springArray: Spring[];
    protected requestAnimationID: null | number;

    private userInteractivePostion: Vector;
    constructor({
        Spring,
        springNumber,
        //* -- spring property options
        springDampArray,
        springKArray,
        springMassArray,
        springStretchedLengthArray,
        springRadiusArray,
        //* -- spring property options
        ref,
        styleClassName,
        constructorOption,
    }: ManagerConstructorProps<ConstructorOption>) {
        if (springDampArray.length !== springNumber)
            throw Error("check, springDampArray length");
        if (springKArray.length !== springNumber)
            throw Error("check, springKArray length");
        if (springMassArray.length !== springNumber)
            throw Error("check, springMassArray length");

        this.canvasApp = new Canvas({
            ref,
            styleClassName,
        });

        this.requestAnimationID = null;

        this.userInteractivePostion = new Vector({
            x: this.canvasApp.width / 2,
            y: this.canvasApp.height / 2,
        });

        this.springNumber = springNumber;
        this.springArray = Array.from({ length: this.springNumber }).map(
            (_, order) =>
                new Spring({
                    ctx: this.canvasApp.ctx,
                    width: this.canvasApp.width,
                    height: this.canvasApp.height,
                    mass: springMassArray[order],
                    damp: springDampArray[order],
                    k: springKArray[order],
                    springRadius: springRadiusArray[order],
                    stretchedLength: springStretchedLengthArray[order],
                    ...constructorOption,
                })
        );

        //* 첫번째 스프링의 staticPosition 설정
        window.addEventListener("mousemove", (e) => {
            this.userInteractivePostion.x = e.clientX;
            this.userInteractivePostion.y = e.clientY;
        });
    }

    public setUp() {
        window.addEventListener("load", () => this.canvasApp.setCanvasSize());
        window.addEventListener("resize", () => this.canvasApp.setCanvasSize());
    }

    public playSpring = () => {
        this.requestAnimationID = requestAnimationFrame(this.playSpring);

        this.canvasApp.claerCanvas();
        for (let i = 0; i < this.springNumber; i++) {
            if (i === 0) {
                //* 첫번째 스프링은 userInteractivePostion을 staticPosition으로 이용
                this.springArray[i].play(this.userInteractivePostion);
            } else {
                //* 상위 스프링의 위치를 staticPosition 으로 사용
                this.springArray[i].play(this.springArray[i - 1].activePosition);
            }
        }
    };

    public stopSpring() {
        this.canvasApp.claerCanvas();
        this.canvasApp.ctx.font = "48px -apple-system, sans-serif";
        this.canvasApp.ctx.fillStyle = "#ffffff";
        this.canvasApp.ctx.fillText(
            "Animation ⛔️",
            this.canvasApp.width / 2 - 150,
            this.canvasApp.height / 2
        );

        cancelAnimationFrame(this.requestAnimationID!);
    }
}

export { SpringManager, Player };
