export enum saveType {
  Download,
  NativeFS
}

class SavePicture {
  constructor() { }

  save(blob: Blob, type: saveType, _fileName?: string) {
    let fileName = _fileName;
    if (!fileName) {
      const arr = new Uint32Array(1);
      const randArr = window.crypto.getRandomValues(arr);
      fileName = `download-${randArr[0]}`;
    }

    if (type === saveType.Download) {
      this.saveAsDownload(blob, fileName);
    } else if (type === saveType.NativeFS) {
      this.saveWithNativeFS();
    }
  }

  private saveAsDownload(blob: Blob, fileName: string) {
    let aElement = <HTMLAnchorElement>document.getElementById('--unjs-save-download-a-element');
    if(!aElement) {
      aElement = document.createElement('a');
      aElement.style.visibility = 'none';
    }
    const url = URL.createObjectURL(blob);
    aElement.setAttribute('download', `${fileName}`);
    aElement.setAttribute('href', url);
    aElement.click();
    URL.revokeObjectURL(url);
  }

  private saveWithNativeFS() {
    console.log('saveWithNativeFS', 'toDo');
  }


}

export const savePicture = new SavePicture();