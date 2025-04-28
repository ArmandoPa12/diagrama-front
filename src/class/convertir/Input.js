import { Base } from "./Base.js";

export class Input extends Base {
    render() {
        return `
        <input 
        formControlName="${this.text}"
        class="form-control"
          type="${this.type}"
          placeholder="${this.text || ""}"/>
     `;
    }
}