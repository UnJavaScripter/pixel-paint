class SaveHandler {
  constructor() { }

  saveAsDownload(blob: Blob, fileName?: string) {
    let aElement = <HTMLAnchorElement>document.getElementById('--unjs-save-download-a-element');
    if(!aElement) {
      aElement = document.createElement('a');
      aElement.style.visibility = 'none';
    }
    const url = URL.createObjectURL(blob);
    aElement.setAttribute('download', `${fileName || this.getRandomNameHash()}`);
    aElement.setAttribute('href', url);
    aElement.click();
    URL.revokeObjectURL(url);
  }

  async saveWithNativeFS(blob: Blob, fileHandle: any) {
    const writer = await fileHandle.createWriter({ keepExistingData: true });
    await writer.write(0, blob);
    await writer.close();
  }

  private getRandomNameHash() {
    const arr = new Uint32Array(1);
    const randArr = window.crypto.getRandomValues(arr);
    return `download-${randArr[0]}`;
  }

}

export const saveHandler = new SaveHandler();