class PixelPaint {
  canvasElem: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  clicked = false;
  pixelSize: number;
  history: any = [];
  lastDrawnPixel: any;

  constructor(pixelSize = 20, width = window.innerWidth, height = window.innerHeight - 15) {
    this.canvasElem = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d');
    this.pixelSize = pixelSize;
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    this.lastDrawnPixel = {};
    this.init();
  }

  init() {
    console.log('init')

    this.canvasElem.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });

    this.canvasElem.addEventListener('mousedown', (event: MouseEvent) => {
      this.handleClick(event);
    });

    this.canvasElem.addEventListener('mousemove', (event: MouseEvent) => {
      this.handleDrag(event);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyUp(event);
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.handleKeyDown(event);
    });

    this.drawGrid();
  }

  private handleMouseUp(): void {
    this.clicked = false;
  }

  private handleClick(event: MouseEvent): void {
    this.clicked = true;
    this.pointerDraw(event);
  }

  private handleDrag(event: MouseEvent): void {
    this.pointerDraw(event);
  }

  private pointerDraw(event: MouseEvent): void {
    if (this.clicked) {
      const correctedX = event.x - 9;
      const correctedY = event.y - 9;
      this.drawPixel(correctedX, correctedY);
    }

  }

  private drawPixel(x: number, y: number, isHistoryEvent = false): void {
    const pixelXstart = x - (x % this.pixelSize);
    const pixelYstart = y - (y % this.pixelSize);
    if(pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y) {
      return;
    }

    this.lastDrawnPixel.x = pixelXstart;
    this.lastDrawnPixel.y = pixelYstart;

    if (!isHistoryEvent) {
      this.history.push([pixelXstart, pixelYstart]);
    }
    this.ctx.fillStyle = '#ca0e51';
    this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
    console.log('drawn')
    console.log(this.history.length)
  }

  private drawGrid(): void {
    this.ctx.fillStyle = '#666'
    this.ctx.strokeStyle = '#0ff'

    this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);

    this.ctx.strokeStyle = '#777';
    this.ctx.beginPath();
    for (let i = 0; i <= this.canvasElem.width; i += this.pixelSize) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvasElem.height);
    }
    for (let i = 0; i <= this.canvasElem.height; i += this.pixelSize) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvasElem.width, i);
    }
    this.ctx.stroke();
  }

  ranDraw(pixelAmount: number) {
    let lastX = 0;
    let lastY = 0;
    for (let i = 0; i <= pixelAmount; i++) {
      const x = Math.floor(Math.random() * lastX + 200 || this.canvasElem.width);
      const y = Math.floor(Math.random() * lastY + 200 || this.canvasElem.height);
      this.drawPixel(x, y);
      if (lastX <= 0) {
        lastX = x
        lastY = y
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 90) {
      if (event.ctrlKey) {
        this.undo();
      }
    }
  }
  private handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 90) {
      if (event.ctrlKey) {
        this.undo();
      }
    }
  }


  private undo() {
    this.history.pop();
    const raf = requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
      this.drawGrid()
      this.history.forEach((element: any) => {
        console.log(element)
        this.drawPixel(element[0], element[1], true);
        cancelAnimationFrame(raf);
      });
      this.lastDrawnPixel = {};
    });
    console.log(this.history.length)
  }

}

new PixelPaint()
