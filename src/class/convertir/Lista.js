import { Base } from "./Base.js";

export class Lista extends Base {
    render() {
        if (this.children.length === 0) {
            return `
                <ul class="list-group"></ul>
            `;
        }

        const items = this.children.map(child => {
            return `<li class="list-group-item">${child.text}</li>`;
        }).join('');

        return `
            <ul class="list-group">
                <li *ngFor="let item${this.key} of ${this.type}_${this.key}"  class="list-group-item" >
                    {{ item${this.key} }}
                </li>
            </ul>
        `;
    }
}