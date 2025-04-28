import { Base } from "./Base.js";
import { Table } from "./Table.js";
import { Form } from "./Form.js";
import { Lista } from "./Lista.js";
import { Link } from "./Link.js";
import { Text } from "./Text.js";
import { Input } from "./Input.js";
import { Nav } from "./Nav.js";
import { Button } from "./Button.js";

export class Lienzo extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        if (this.children.length === 0) {
            return `<div class="container"></div>`;
        }

        const sortedChildren = [...this.children].sort((a, b) => {
            const aY = parseFloat(a.loc.split(' ')[1]);
            const bY = parseFloat(b.loc.split(' ')[1]);
            return aY - bY;
        });

        const rows = [];
        let currentRow = [];
        let maxYInRow = null;

        sortedChildren.forEach(child => {
            const [x, y] = child.loc.split(' ').map(parseFloat);

            if (
                maxYInRow === null ||
                Math.abs(y - maxYInRow) <= 40 // Umbral para considerar misma fila
            ) {
                currentRow.push(child);
                maxYInRow = Math.max(maxYInRow ?? y, y);
            } else {
                rows.push(currentRow);
                currentRow = [child];
                maxYInRow = y;
            }
        });

        if (currentRow.length) rows.push(currentRow);

        const htmlRows = rows.map(row => {
            const cols = row.map(child => {
                const instancia = this.instanciarElemento(child);
                return `<div class="col">${instancia ? instancia.render() : ''}</div>`;
            });

            return `<div class="row p-1 ">${cols.join('\n')}</div>`;
        });

        return `<div class="container">${htmlRows.join('\n')}</div>`;
    }

    instanciarElemento(data) {

        switch (data.type) {
            case 'texto':
                return new Text(data);
            case 'input':
                return new Input(data);
            case 'text':
                return new Input(data);
                // case 'submit':
                //     return new Submit(data);
            case 'nav':
                return new Nav(data);
            case 'link':
                return new Link(data);
            case 'div':
                return new Lienzo(data);
            case 'form':
                return new Form(data);
            case 'table':
                return new Table(data);
            case 'button':
                return new Button(data);
            case 'list':
                return new Lista(data);
            default:
                return null;
        }
    }
}