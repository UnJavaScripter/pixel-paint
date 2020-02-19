"use strict";
var PixelPaint = /** @class */ (function () {
    function PixelPaint(pixelSize, width, height) {
        if (pixelSize === void 0) { pixelSize = 20; }
        if (width === void 0) { width = window.innerWidth; }
        if (height === void 0) { height = window.innerHeight - 15; }
        this.clicked = false;
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.pixelSize = pixelSize;
        this.canvasElem.width = width;
        this.canvasElem.height = height;
        this.init();
    }
    PixelPaint.prototype.init = function () {
        var _this = this;
        console.log('init');
        this.ctx.fillStyle = '#666';
        this.ctx.strokeStyle = '#0ff';
        this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.ctx.strokeRect(0, 0, this.canvasElem.width, this.canvasElem.height);
        this.canvasElem.addEventListener('mouseup', function () {
            _this.handleMouseUp();
        });
        this.canvasElem.addEventListener('mousedown', function (event) {
            _this.handleClick(event);
        });
        this.canvasElem.addEventListener('mousemove', function (event) {
            _this.handleDrag(event);
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
    PixelPaint.prototype.drawPixel = function (x, y) {
        var pixelXstart = x - (x % this.pixelSize);
        var pixelYstart = y - (y % this.pixelSize);
        this.ctx.fillStyle = '#ca0e51';
        this.ctx.fillRect(pixelXstart, pixelYstart, this.pixelSize, this.pixelSize);
    };
    PixelPaint.prototype.drawGrid = function () {
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
    return PixelPaint;
}());
new PixelPaint();
