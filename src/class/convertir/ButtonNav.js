import { Base } from "./Base.js";

export class ButtonNav extends Base {
    render() {
        const style = `position: relative; top: ${this.y}px; left: ${this.x}px;`;
        return `<a class="navbar-brand" href="/${this.text}" >${this.text}</a>`;
    }
}