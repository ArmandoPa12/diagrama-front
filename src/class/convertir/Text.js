import { Base } from "./Base.js";


export class Text extends Base {
    render() {
        return `
        <p class="form-text" >
          ${this.text}
        </p>
      `;
    }
}