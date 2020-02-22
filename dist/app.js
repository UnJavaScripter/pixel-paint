"use strict";
var PixelPaint = /** @class */ (function () {
    function PixelPaint(pixelSize, width, height) {
        if (pixelSize === void 0) { pixelSize = 20; }
        if (width === void 0) { width = window.innerWidth; }
        if (height === void 0) { height = window.innerHeight - 15; }
        this.clicked = false;
        this.history = [];
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.pixelSize = pixelSize;
        this.canvasElem.width = width;
        this.canvasElem.height = height;
        this.lastDrawnPixel = {};
        this.init();
    }
    PixelPaint.prototype.init = function () {
        var _this = this;
        console.log('init');
        this.canvasElem.addEventListener('mouseup', function () {
            _this.handleMouseUp();
        });
        this.canvasElem.addEventListener('mousedown', function (event) {
            _this.handleClick(event);
        });
        this.canvasElem.addEventListener('mousemove', function (event) {
            _this.handleDrag(event);
        });
        window.addEventListener('keydown', function (event) {
            _this.handleKeyUp(event);
        });
        window.addEventListener('keyup', function (event) {
            _this.handleKeyDown(event);
        });
        this.drawGrid();
    };
    PixelPaint.prototype.handleMouseUp = function () {
        this.clicked = false;
    };
    PixelPaint.prototype.handleClick = function (event) {
        this.clicked = true;
        this.pointerDraw(event);
    };
    PixelPaint.prototype.handleDrag = function (event) {
        this.pointerDraw(event);
    };
    PixelPaint.prototype.pointerDraw = function (event) {
        if (this.clicked) {
            var correctedX = event.x - 9;
            var correctedY = event.y - 9;
            this.drawPixel(correctedX, correctedY);
        }
    };
    PixelPaint.prototype.drawPixel = function (x, y, isHistoryEvent) {
        if (isHistoryEvent === void 0) { isHistoryEvent = false; }
        var pixelXstart = x - (x % this.pixelSize);
        var pixelYstart = y - (y % this.pixelSize);
        if (pixelXstart === this.lastDrawnPixel.x && pixelYstart === this.lastDrawnPixel.y) {
            return;
        }
        this.lastDrawnPixel.x = pixelXstart;
        this.lastDrawnPixel.y = pixelYstart;
        if (!isHistoryEvent) {
            this.history.push([pixelXstart, pixelYstart]);
        }
        this.ctx.fillStyle = '#ca0e51';
        this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
        console.log('drawn');
        console.log(this.history.length);
    };
    PixelPaint.prototype.drawGrid = function () {
        this.ctx.fillStyle = '#666';
        this.ctx.strokeStyle = '#0ff';
        this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.ctx.strokeStyle = '#777';
        this.ctx.beginPath();
        for (var i = 0; i <= this.canvasElem.width; i += this.pixelSize) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvasElem.height);
        }
        for (var i = 0; i <= this.canvasElem.height; i += this.pixelSize) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvasElem.width, i);
        }
        this.ctx.stroke();
    };
    PixelPaint.prototype.ranDraw = function (pixelAmount) {
        var lastX = 0;
        var lastY = 0;
        for (var i = 0; i <= pixelAmount; i++) {
            var x = Math.floor(Math.random() * lastX + 200 || this.canvasElem.width);
            var y = Math.floor(Math.random() * lastY + 200 || this.canvasElem.height);
            this.drawPixel(x, y);
            if (lastX <= 0) {
                lastX = x;
                lastY = y;
            }
        }
    };
    PixelPaint.prototype.handleKeyUp = function (event) {
        if (event.keyCode === 90) {
            if (event.ctrlKey) {
                this.undo();
            }
        }
    };
    PixelPaint.prototype.handleKeyDown = function (event) {
        if (event.keyCode === 90) {
            if (event.ctrlKey) {
                this.undo();
            }
        }
    };
    PixelPaint.prototype.undo = function () {
        var _this = this;
        this.history.pop();
        var raf = requestAnimationFrame(function () {
            _this.ctx.clearRect(0, 0, _this.canvasElem.width, _this.canvasElem.height);
            _this.drawGrid();
            _this.history.forEach(function (element) {
                console.log(element);
                _this.drawPixel(element[0], element[1], true);
                cancelAnimationFrame(raf);
            });
            _this.lastDrawnPixel = {};
        });
        console.log(this.history.length);
    };
    return PixelPaint;
}());
new PixelPaint();
