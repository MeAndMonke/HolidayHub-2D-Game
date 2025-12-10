let _c = null;
let _ctx = null;

export function getCanvas() {
    if (!_c) {
        _c = document.getElementById("gameWindow");
    }
    return _c;
}

export function getContext() {
    if (!_ctx) {
        const canvas = getCanvas();
        _ctx = canvas.getContext("2d");
    }
    return _ctx;
}
