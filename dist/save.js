var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SaveHandler {
    constructor() { }
    saveAsDownload(blob, fileName) {
        let aElement = document.getElementById('--unjs-save-download-a-element');
        if (!aElement) {
            aElement = document.createElement('a');
            aElement.style.visibility = 'none';
        }
        const url = URL.createObjectURL(blob);
        aElement.setAttribute('download', `${fileName || this.getRandomNameHash()}`);
        aElement.setAttribute('href', url);
        aElement.click();
        URL.revokeObjectURL(url);
    }
    saveWithNativeFS(blob, fileHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = yield fileHandle.createWriter({ keepExistingData: true });
            yield writer.write(0, blob);
            yield writer.close();
        });
    }
    getRandomNameHash() {
        const arr = new Uint32Array(1);
        const randArr = window.crypto.getRandomValues(arr);
        return `download-${randArr[0]}`;
    }
}
export const saveHandler = new SaveHandler();
