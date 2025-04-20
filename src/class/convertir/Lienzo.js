import { Base } from "./Base.js";

export class Lienzo extends Base {
    render() {
        // Un <div> con fondo claro y sin contenido
        return `
        <div style="${this.getStyle()} background: ${this.color};">
          ${this.label || ""}
        </div>
      `;
    }
}