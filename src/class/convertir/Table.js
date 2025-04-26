import { Base } from "./Base.js";
import { Button } from "./Button.js";

export class Table extends Base {
    render() {
            if (this.children.length === 0) {
                return `<table class="table"><thead><tr><th>Sin elementos</th></tr></thead></table>`;
            }

            const titles = this.children.filter(child => child.type === 'title');
            const bodies = this.children.filter(child =>
                child.type === 'body' || child.type === 'button'
            );

            const headers = titles.map(title => `<th scope="col">${title.text || ''}</th>`).join('');

            let bodyRows = '';

            if (bodies.length > 0) {
                const thresholdY = 35;
                const thresholdX = 35;
                const rows = [];

                for (const item of bodies) {
                    const [, y] = item.loc.split(' ').map(Number);
                    let added = false;

                    for (const row of rows) {
                        const [, rowY] = row[0].loc.split(' ').map(Number);
                        if (Math.abs(y - rowY) <= thresholdY) {
                            row.push(item);
                            added = true;
                            break;
                        }
                    }

                    if (!added) {
                        rows.push([item]);
                    }
                }
                bodyRows = rows.map((row, rowIndex) => {
                    row.sort((a, b) => {
                        const [x1] = a.loc.split(' ').map(Number);
                        const [x2] = b.loc.split(' ').map(Number);
                        return x1 - x2;
                    });
                    const titleXPositions = titles.map(t => Number(t.loc.split(' ')[0]));
                    const cells = [];

                    for (let i = 0; i < titles.length; i++) {
                        const titleX = titleXPositions[i];
                        const match = row.find(cell => {
                            const [x] = cell.loc.split(' ').map(Number);
                            return Math.abs(x - titleX) <= thresholdX;
                        });

                        if (match) {
                            if (match.type === 'button') {
                                const btn = new Button(match);
                                cells.push(`<td>${btn.render()}</td>`);
                            } else {
                                if (i === 0) {
                                    cells.push(`<th scope="row">${match.text || ''}</th>`);
                                } else {
                                    cells.push(`<td>${match.text || ''}</td>`);
                                }
                            }
                        } else {
                            cells.push(`<td></td>`);
                        }
                    }

                    return `<tr>${cells.join('')}</tr>`;
                }).join('\n');
            }

            const finalHtml = `
<table class="table">
    ${titles.length > 0 ? `<thead><tr>${headers}</tr></thead>` : ''}
    ${bodies.length > 0 ? `<tbody>${bodyRows}</tbody>` : ''}
</table>`;

        return finalHtml;
    }
}