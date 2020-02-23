import { HistoryHandler } from './history.js';
class PixelPaint {
    constructor(pixelSize = 20, width = window.innerWidth, height = window.innerHeight - 15) {
        this.clicked = false;
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.pixelSize = pixelSize;
        this.canvasElem.width = width;
        this.canvasElem.height = height;
        this.lastDrawnPixel = {};
        this.historyHandler = new HistoryHandler();
        this.init();
    }
    init() {
        console.log('init');
        this.canvasElem.addEventListener('mouseup', () => {
            this.handleMouseUp();
        });
        this.canvasElem.addEventListener('mousedown', (event) => {
            this.handleClick(event);
        });
        this.canvasElem.addEventListener('mousemove', (event) => {
            this.handleDrag(event);
        });
        window.addEventListener('keydown', (event) => {
            this.handleKeyUp(event);
        });
        this.drawGrid();
    }
    handleMouseUp() {
        this.clicked = false;
    }
    handleClick(event) {
        this.clicked = true;
        this.pointerDraw(event);
    }
    handleDrag(event) {
        this.pointerDraw(event);
    }
    pointerDraw(event) {
        if (this.clicked) {
            const correctedX = event.x - 9;
            const correctedY = event.y - 9;
            this.drawPixel(correctedX, correctedY);
        }
    }
    drawPixel(x, y, color = "#ca0e51", isHistoryEvent = false) {
        const pixelXstart = x - (x % this.pixelSize);
        const pixelYstart = y - (y % this.pixelSize);
        if (pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
            return;
        }
        this.lastDrawnPixel.x = pixelXstart;
        this.lastDrawnPixel.y = pixelYstart;
        this.lastDrawnPixel.color = color;
        if (!isHistoryEvent) {
            this.historyHandler.push({ x: pixelXstart, y: pixelYstart, color });
        }
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
        // this.ctx.fillText(`${pixelXstart}, ${pixelYstart}`, pixelXstart, pixelYstart, 800);
    }
    drawGrid() {
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
    ranDraw(pixelAmount) {
        let lastX = 0;
        let lastY = 0;
        for (let i = 0; i <= pixelAmount; i++) {
            const x = Math.floor(Math.random() * lastX + 200 || this.canvasElem.width);
            const y = Math.floor(Math.random() * lastY + 200 || this.canvasElem.height);
            this.drawPixel(x, y);
            if (lastX <= 0) {
                lastX = x;
                lastY = y;
            }
        }
    }
    handleKeyUp(event) {
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
    undo() {
        this.historyHandler.undo();
        this.reDraw();
    }
    redo() {
        this.historyHandler.redo();
        this.reDraw();
    }
    reDraw() {
        const raf = requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            this.drawGrid();
            this.historyHandler.history.forEach((element, key) => {
                this.drawPixel(element.x, element.y, element.color, true);
            });
            cancelAnimationFrame(raf);
        });
    }
}
new PixelPaint();
