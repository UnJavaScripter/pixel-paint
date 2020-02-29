export class ColorPicker {
    constructor() {
        this.pickerElem = document.createElement('div');
        this.colorsList = [
            '#ffffff',
            '#000000',
            '#C0C0C0',
            '#808080',
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#00FFFF',
            '#FF00FF',
            '#FFFF00',
            '#008080',
            '#800080',
            '#808000',
            '#800000',
            '#008000',
            '#000080'
        ];
        this._selectedColor = this.colorsList[0];
        this.init();
        this.initHoverHandler();
    }
    init() {
        this.pickerElem.addEventListener('pointerleave', (event) => {
            this.pickerElem.style.transform = 'translateX(-50%) translateY(90%)';
        });
        for (let i = 0; i < this.colorsList.length; i++) {
            const colorTileElem = document.createElement('div');
            colorTileElem.style.width = '12.5%';
            colorTileElem.style.height = '5vh';
            colorTileElem.style.display = 'flex';
            colorTileElem.style.backgroundColor = this.colorsList[i];
            colorTileElem.addEventListener('click', () => {
                this.colorSelected(this.colorsList[i]);
            });
            this.pickerElem.appendChild(colorTileElem);
        }
        this.pickerElem.style.width = '90%';
        this.pickerElem.style.display = 'flex';
        this.pickerElem.style.position = 'fixed';
        this.pickerElem.style.bottom = '0';
        this.pickerElem.style.marginLeft = '50%';
        this.pickerElem.style.marginRight = '50%';
        this.pickerElem.style.transform = 'translateX(-50%) translateY(90%)';
        this.pickerElem.style.willChange = 'transform';
        this.pickerElem.style.transition = 'transform 0.15s cubic-bezier(0,0,0.3,1)';
        if (window.innerWidth < 1080) {
            this.pickerElem.style.width = '100%';
            this.pickerElem.style.flexWrap = 'wrap';
        }
        document.body.appendChild(this.pickerElem);
    }
    colorSelected(color) {
        this._selectedColor = color;
    }
    get selectedColor() {
        return this._selectedColor;
    }
    initHoverHandler() {
        document.addEventListener('pointermove', (event) => {
            if (event.y > window.innerHeight - 25 && event.buttons === 0) {
                this.pickerElem.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    }
}
