class UI {
    static get windows() {
        return {};
    }

    static createWindow(data) {
        let win = UI.windows[data.id] = new Window(data.id);

    }
}