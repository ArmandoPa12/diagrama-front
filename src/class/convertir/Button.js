import { Base } from "./Base.js";

export class Button extends Base {
    render() {
        return `
        <button type="button" class="btn btn-primary">${this.text}</button>
     `;
    }
}