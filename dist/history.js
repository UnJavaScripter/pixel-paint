export class HistoryHandler {
    constructor() {
        this.historySize = 0;
        this._history = new Map();
        this.historySize = 0;
        this.historyRedo = new Map();
    }
    get history() {
        return this._history;
    }
    push(action) {
        if (this.historyRedo.size) {
            this.historyRedo.clear();
        }
        const nextPosition = this._history.size;
        this._history.set(nextPosition, action);
        return nextPosition;
    }
    undo() {
        const historySize = this._history.size;
        if (historySize) {
            const lastHistoryElem = this._history.get(historySize - 1);
            this.historyRedo.set(this.historyRedo.size, lastHistoryElem);
            this._history.delete(historySize - 1);
        }
    }
    redo() {
        const historyRedoSize = this.historyRedo.size;
        if (historyRedoSize) {
            const lastHistoryRedoElem = this.historyRedo.get(historyRedoSize - 1);
            this.history.set(this._history.size, lastHistoryRedoElem);
            this.historyRedo.delete(historyRedoSize - 1);
        }
    }
}
