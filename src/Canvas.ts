export interface CanvasConstructorProps {
    readonly ref: HTMLElement;
    readonly styleClassName?: string;
}

class Canvas {
    static instance: Canvas;

    private readonly containerObject: HTMLElement;
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;

    private readonly pixelRatio: number;
    public width: number;
    public height: number;

    constructor({ ref, styleClassName }: CanvasConstructorProps) {
        Canvas.instance = this;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.className = styleClassName!;

        this.containerObject = ref;

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.containerObject.appendChild(this.canvas);
    }

    private setSize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    public setCanvasSize() {
        this.setSize();
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    public claerCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public trailingCanvas() {
        const TRAILING_COLOR = "rgba(255, 255, 255, .5)";
        this.ctx.fillStyle = TRAILING_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}

export { Canvas };
