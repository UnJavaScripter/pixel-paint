export var saveType;
(function (saveType) {
    saveType[saveType["Download"] = 0] = "Download";
    saveType[saveType["NativeFS"] = 1] = "NativeFS";
})(saveType || (saveType = {}));
class SavePicture {
    constructor() { }
    save(blob, type, _fileName) {
        let fileName = _fileName;
        if (!fileName) {
            const arr = new Uint32Array(1);
            const randArr = window.crypto.getRandomValues(arr);
            fileName = `download-${randArr[0]}`;
        }
        if (type === saveType.Download) {
            this.saveAsDownload(blob, fileName);
        }
        else if (type === saveType.NativeFS) {
            this.saveWithNativeFS();
        }
    }
    saveAsDownload(blob, fileName) {
        let aElement = document.getElementById('--unjs-save-download-a-element');
        if (!aElement) {
            aElement = document.createElement('a');
            aElement.style.visibility = 'none';
        }
        const url = URL.createObjectURL(blob);
        aElement.setAttribute('download', `${fileName}`);
        aElement.setAttribute('href', url);
        aElement.click();
        URL.revokeObjectURL(url);
    }
    saveWithNativeFS() {
        console.log('saveWithNativeFS', 'toDo');
    }
}
export const savePicture = new SavePicture();
