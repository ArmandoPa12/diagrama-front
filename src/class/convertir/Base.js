// Clase base que encapsula las propiedades comunes
export class Base {
    constructor(data) {
        this.key = data.key;
        this.category = data.category || "";
        this.loc = data.loc || "0 0";
        this.color = data.color || "#ffffff";
        this.size = data.size || "100 100";
        this.label = data.label || "";
        this.type = data.type || "";
        this.text = data.text || "";
        this.fontSize = data.fontSize || 12;
        this.opciones = data.opciones || [];
        this.validation = data.validation || [];
        this.children = data.children || [];

        const [x, y] = this.loc.split(" ").map(Number);
        const [w, h] = this.size.split(" ").map(Number);
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    getStyle() {
        return `position: absolute; top: ${this.y}px; left: ${this.x}px; width: ${this.width}px; height: ${this.height}px;`;
    }

    render() {
        return `<div></div>`;
    }
}