import { Base } from "./Base.js";


export class Text extends Base {
    render() {
        // Elegimos etiqueta según fontSize; aquí un <div> genérico
        const sizeStyle = this.fontSize ? `font-size: ${this.fontSize}px;` : "";
        return `
        <div style="${this.getStyle()} ${sizeStyle}">
          ${this.text}
        </div>
      `;
    }
}