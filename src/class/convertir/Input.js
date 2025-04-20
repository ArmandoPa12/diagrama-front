import { Base } from "./Base.js";

export class Input extends Base {
    render() {
        // Usamos `type` para saber email, password, text…
        return `
        <input
          type="${this.type}"
          value="${this.text || ""}"
          style="${this.getStyle()} background: ${this.color};"
        />
     `;
    }
}