import { Base } from "./Base.js";
import { ButtonNav } from "./ButtonNav.js";

export class Nav extends Base {
    render() {
        const buttons = this.children.map(child => {
            const btn = new ButtonNav(child);
            return btn.render();
        }).join('\n');

        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px;`;

        return `

    <nav style="position: relative;" class="navbar navbar-expand-lg navbar-light bg-light">
        ${buttons}
    </nav>
`;
    }
}