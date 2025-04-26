import { Base } from "./Base.js";
import { Input } from "./Input.js";
import { Lienzo } from "./Lienzo.js";
import { Link } from "./Link.js";
import { Select } from "./Select.js";
import { Submit } from "./Submit.js";
import { Text } from "./Text.js";

export class Form extends Base {
    render() {
        const elementosValidos = ['input', 'div', 'submit', 'link', 'text','texto','number'];

        const hijosFiltrados = this.children.sort((a, b) => {
            const aY = parseFloat(a.loc.split(' ')[1]);
            const bY = parseFloat(b.loc.split(' ')[1]);
            return aY - bY;
        });

        const rows = [];
        let currentRow = [];
        let maxYInRow = null;

        hijosFiltrados.forEach(child => {
            const [x, y] = child.loc.split(' ').map(parseFloat);

            if (
                maxYInRow === null ||
                Math.abs(y - maxYInRow) <= 40
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
            // Ordenar por X antes de procesar columnas
            // row.sort((a, b) => {
            //     const aX = parseFloat(a.loc.split(' ')[0]);
            //     const bX = parseFloat(b.loc.split(' ')[0]);
            //     return aX - bX;
            // });
        
            const cols = row.map(child => {
                const instancia = this.instanciarElemento(child);
                return instancia ? instancia.render(): ''

                // return `<div class="col">${instancia ? instancia.render() : ''}</div>`;
            });
        
            return `<div class="row">${cols.join('\n')}</div>`;
        });

        return `<form  [formGroup]="formulario" (ngSubmit)="enviarFormulario()" class="p-4 border rounded shadow-sm bg-white">${htmlRows.join('\n')}</form>`;
    }

    instanciarElemento(data) {

        switch (data.type) {
            case 'texto':
                return new Text(data);
            case 'input':
                return new Input(data);
            case 'number':
                return new Input(data);
            case 'text':
                return new Input(data);
            case 'password':
                return new Input(data);
            case 'select':
                return new Select(data);
            case 'email':
                return new Input(data);
            case 'submit':
                return new Submit(data);
            case 'div':
                return new Lienzo(data);
            case 'link':
                return new Link(data);
            
            default:    
                return null;
        }
    }
}