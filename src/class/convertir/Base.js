// Clase base que encapsula las propiedades comunes
export class Base {
    constructor(data) {
        this.key = data.key;
        this.category = data.category;
        this.loc = data.loc || "0 0";
        this.color = data.color || "#ffffff";
        this.size = data.size || "100 100";
        this.label = data.label || "";
        this.type = data.type || "";

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
        return `<div style="${this.getStyle()} background: ${this.color};">${this.label}</div>`;
    }
}