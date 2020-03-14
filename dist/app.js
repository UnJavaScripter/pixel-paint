var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { historyHandler } from './history.js';
import { ColorPicker } from './color-picker.js';
import { saveHandler } from './save.js';
const colorPicker = new ColorPicker();
class PixelPaint {
    constructor(pixelSize = 50, width = window.innerWidth, height = window.innerHeight - 4) {
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.pixelSize = pixelSize;
        this.canvasElem.width = width;
        this.canvasElem.height = height;
        this.lastDrawnPixel = {};
        this.selectedColor = colorPicker.selectedColor;
        this.drawning = { fileHandle: undefined };
        this.init();
    }
    init() {
        this.canvasElem.addEventListener('pointerdown', (event) => {
            this.handleClick(event);
        });
        this.canvasElem.addEventListener('pointermove', (event) => {
            this.handleDrag(event);
        });
        window.addEventListener('keydown', (event) => {
            this.handleKeyUp(event);
        });
        this.drawGrid();
    }
    handleClick(event) {
        this.pointerDraw(event);
    }
    handleDrag(event) {
        this.pointerDraw(event);
    }
    pointerDraw(event) {
        if (event.buttons === 1) {
            const correctedX = event.x - 9;
            const correctedY = event.y - 9;
            this.drawPixel(correctedX, correctedY, colorPicker.selectedColor);
        }
    }
    drawPixel(x, y, color = '#ca0e51', isHistoryEvent = false) {
        const pixelXstart = x - (x % this.pixelSize);
        const pixelYstart = y - (y % this.pixelSize);
        if (pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y && color === this.lastDrawnPixel.color) {
            return;
        }
        this.lastDrawnPixel.x = pixelXstart;
        this.lastDrawnPixel.y = pixelYstart;
        this.lastDrawnPixel.color = color;
        if (!isHistoryEvent) {
            historyHandler.push({ x: pixelXstart, y: pixelYstart, color });
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
            const x = Math.floor(Math.random() * lastX || this.canvasElem.width);
            const y = Math.floor(Math.random() * lastY || this.canvasElem.height);
            this.drawPixel(x, y);
            if (lastX <= 0) {
                lastX = x;
                lastY = y;
            }
        }
    }
    handleKeyUp(event) {
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
    getNewFileHandle() {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                type: 'saveFile',
                accepts: [{
                        description: 'Pixel Art image',
                        extensions: ['png'],
                        mimeTypes: ['image/png'],
                    }],
            };
            const handle = window.chooseFileSystemEntries(opts);
            return handle;
        });
    }
    save() {
        this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.reDrawPixelsFromHistory();
        this.canvasElem.toBlob((blob) => __awaiter(this, void 0, void 0, function* () {
            if (!blob) {
                return;
            }
            if ('chooseFileSystemEntries' in window) {
                if (!this.drawning.fileHandle) {
                    this.drawning.fileHandle = yield this.getNewFileHandle();
                }
                saveHandler.saveWithNativeFS(blob, this.drawning.fileHandle);
            }
            else {
                saveHandler.saveAsDownload(blob, 'pixel-art.png');
            }
            this.reDraw();
        }));
    }
    undo() {
        historyHandler.undo();
        this.reDraw();
    }
    redo() {
        historyHandler.redo();
        this.reDraw();
    }
    reDraw() {
        const raf = requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            this.drawGrid();
            this.reDrawPixelsFromHistory();
            cancelAnimationFrame(raf);
        });
    }
    reDrawPixelsFromHistory() {
        historyHandler.history.forEach((element, key) => {
            this.drawPixel(element.x, element.y, element.color, true);
        });
    }
    discardAndNew() {
        this.drawning.fileHandle = undefined;
        historyHandler.clear();
        this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.drawGrid();
    }
}
new PixelPaint();
