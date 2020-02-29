import { historyHandler } from './history.js';
import { ColorPicker } from './color-picker.js';
import { saveHandler } from './save.js'

const colorPicker = new ColorPicker();

export interface DrawAction {
  x: number;
  y: number;
  color: string;
}

interface Drawning {
  fileHandle: any
}

class PixelPaint {
  canvasElem: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  clicked = false;
  pixelSize: number;
  lastDrawnPixel: any;
  selectedColor: string;
  drawning: Drawning;


  constructor(pixelSize = 80, width = window.innerWidth, height = window.innerHeight - 4) {
    this.canvasElem = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d');
    this.pixelSize = pixelSize;
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    this.lastDrawnPixel = {};
    this.selectedColor = colorPicker.selectedColor;

    this.drawning = {fileHandle: undefined};

    this.init();
  }

  init() {
    this.canvasElem.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });

    this.canvasElem.addEventListener('pointerdown', (event: PointerEvent) => {
      this.handleClick(event);
    });

    this.canvasElem.addEventListener('pointermove', (event: PointerEvent) => {
      this.handleDrag(event);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyUp(event);
    });

    this.drawGrid();
  }

  private handleMouseUp() {
    this.clicked = false;
  }

  private handleClick(event: MouseEvent) {
    this.clicked = true;
    this.pointerDraw(event);
  }

  private handleDrag(event: MouseEvent) {
    this.pointerDraw(event);
  }

  private pointerDraw(event: MouseEvent) {
    if (event.buttons === 1) {
      const correctedX = event.x - 9;
      const correctedY = event.y - 9;
      this.drawPixel(correctedX, correctedY, colorPicker.selectedColor);
    }

  }

  private drawPixel(x: number, y: number, color = '#ca0e51', isHistoryEvent = false) {
    const pixelXstart = x - (x % this.pixelSize);
    const pixelYstart = y - (y % this.pixelSize);

    if(pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
      return;
    }

    this.lastDrawnPixel.x = pixelXstart;
    this.lastDrawnPixel.y = pixelYstart;
    this.lastDrawnPixel.color = color;

    if (!isHistoryEvent) {
      historyHandler.push({x: pixelXstart, y: pixelYstart, color});
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
    
    // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
  }

  private drawGrid() {
    this.ctx.fillStyle = '#666';
    this.ctx.strokeStyle = '#0ff';

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
      const x = Math.floor(Math.random() * lastX || this.canvasElem.width);
      const y = Math.floor(Math.random() * lastY || this.canvasElem.height);
      this.drawPixel(x, y);
      if (lastX <= 0) {
        lastX = x;
        lastY = y;
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 78) {
      if (event.ctrlKey) {
        event.preventDefault();
        this.discardAndNew();
      }
    }
    if (event.keyCode === 83) {
      if (event.ctrlKey) {
        event.preventDefault();
        this.save();
      }
    }
    if (event.keyCode === 89) {
      if (event.ctrlKey) {
        this.redo();
      }
    }
    if (event.keyCode === 90) {
      if (event.ctrlKey) {
        this.undo();
      }
    }
  }

  private async getNewFileHandle() {
    const opts = {
      type: 'saveFile',
      accepts: [{
        description: 'Pixel Art image',
        extensions: ['png'],
        mimeTypes: ['image/png'],
      }],
    };
    const handle = (window as any).chooseFileSystemEntries(opts);
    
    return handle;
  }

  private save() {
    this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.reDrawPixelsFromHistory();
    this.canvasElem.toBlob( async (blob) =>  {
      if(!blob) {
        return;
      }
      if('chooseFileSystemEntries' in window) {
        if(!this.drawning.fileHandle) {
          this.drawning.fileHandle = await this.getNewFileHandle();
        }
        saveHandler.saveWithNativeFS(blob, this.drawning.fileHandle);
      } else {
        saveHandler.saveAsDownload(blob, 'pixel-art.png');
      }
      this.reDraw();
    });
  }

  private undo() {
    historyHandler.undo();
    this.reDraw();
  }

  private redo() {
    historyHandler.redo();
    this.reDraw();
  }

  private reDraw() {
    const raf = requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
      this.drawGrid();
      this.reDrawPixelsFromHistory();
      cancelAnimationFrame(raf);
    });
  }

  private reDrawPixelsFromHistory() {
    historyHandler.history.forEach((element: DrawAction, key: number) => {
      this.drawPixel(element.x, element.y, element.color, true);
    });
  }

  private discardAndNew() {
    this.drawning.fileHandle = undefined;
    historyHandler.clear();
    this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.drawGrid();
  }

}

new PixelPaint();