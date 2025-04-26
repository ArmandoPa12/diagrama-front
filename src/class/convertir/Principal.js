import { Base } from "./Base.js";

// export class Lienzo extends Base {
//     constructor(data) {
//         super(data);
//     }

//     render() {
//         if (this.children.length === 0) {
//             return `<div></div>`;
//         }

//         const renderDivs = this.children.map(child => {
            
//             if (child.type === 'div') {
//                 const div = new Div(child);
//                 return div.render();
//             }
//             const instancia = this.instanciarElemento(child);
//             return instancia ? instancia.render() : '';
//         });

//         return `<div>${renderDivs.join('\n')}</div>`;
//     }

//     instanciarElemento(data) {
//         // console.log('form hijo-------------',data);
//         switch (data.type) {
            
//             case 'texto':
//                 return new Texto(data);
//             case 'input':
//                 return new Input(data);
//             case 'submit':
//                 return new Submit(data);
//             case 'nav':
//                 return new Nav(data);
//             case 'link':
//                 return new Link(data);
//             case 'div':
//                 return new Div(data);
//             case 'form':
//                 return new Form(data);
//             case 'table':
//                 return new Table(data);
//             default:
//                 return null;
//         }
//     }
// }

//✅

// export class Nav extends Base {
//     constructor(data) {
//         super(data);
//     }

//     render() {
//         if (this.children.length > 0) {
//             const items = this.children.map(child => {
//                 return `<li><a href="/${child.text}">${child.label || child.text || 'Link'}</a></li>`;
//             }).join('\n');

//             return `<header><nav>
//     <ul>
//         ${items}
//     </ul>
// </nav></header>`;
//         }

//         return `<header><nav></nav></header>`;
//     }
// }



export class Lienzo extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        if (this.children.length === 0) {
            return `<div class="container position-relative"></div>`;
        }

        const renderDivs = this.children.map(child => {
            if (child.type === 'div') {
                const div = new Div(child);
                return div.render();
            }
            const instancia = this.instanciarElemento(child);
            return instancia ? instancia.render() : '';
        });

        return `<div class="container position-relative" style="width: ${this.width}px;  background-color:brown; height: ${this.height}px;">
${renderDivs.join('\n')}
</div>`;
    }

    instanciarElemento(data) {
        switch (data.type) {
            case 'texto':
                return new Texto(data);
            case 'input':
                return new Input(data);
            case 'submit':
                return new Submit(data);
            case 'nav':
                return new Nav(data);
            case 'link':
                return new Link(data);
            case 'div':
                return new Div(data);
            case 'form':
                return new Form(data);
            case 'table':
                return new Table(data);
            default:
                return null;
        }
    }
}

export class Nav extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const buttons = this.children.map(child => {
            const btn = new ButtonNav(child);
            return btn.render();
        }).join('\n');

        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px;`;

        return `
<div class="container" style="${style}">
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom position-relative">
        ${buttons}
    </header>
</div>`;
    }
}



export class ButtonNav extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px; `;
        // return `<button type="button" class="btn btn-outline-primary" style="${style}">${this.text}</button>`;
        return `<a href="/${this.text}" class="btn btn-primary px-3" style="${style}" >${this.text}</a> `;


    }
}



// export class Form extends Base {
//     constructor(data) {
//         super(data);
//     }

//     render() {
//         if (this.children.length === 0) {
//             return `<form class="p-3 border rounded bg-light"></form>`;
//         }

//         const renderDivs = this.children.map(child => {
//             if (child.type === 'div') {
//                 const div = new Div(child);
//                 return div.render();
//             }
//             const instancia = this.instanciarElemento(child);
//             return instancia ? instancia.render() : '';
//         });

//         return `<form class="p-3 border rounded bg-light">
// ${renderDivs.join('\n')}
// </form>`;
//     }

//     instanciarElemento(data) {
//         switch (data.type) {
//             case 'texto':
//                 return new Texto(data);
//             case 'input':
//                 return new Input(data);
//             case 'submit':
//                 return new Submit(data);
//             case 'link':
//                 return new Link(data);
//             case 'div':
//                 return new Div(data);
//             default:
//                 return null;
//         }
//     }
// }

export class Form extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px; width:${this.width}; height:${this.height}`;

        if (this.children.length === 0) {
            return `<form style="${style}" class="p-4 bg-white rounded shadow-sm">

</form>`;
        }

        const renderDivs = this.children.map(child => {
            if (child.type === 'div') {
                const div = new Div(child);
                return div.render();
            }
            const instancia = this.instanciarElemento(child);
            return instancia ? instancia.render() : '';
        });

        return `<form style="${style}" back class="p-4 bg-white rounded shadow-sm">
${renderDivs.join('\n')}
</form>`;
    }

    instanciarElemento(data) {
        switch (data.type) {
            case 'texto':
                return new Texto(data);
            case 'input':
                return new Input(data);
            case 'submit':
                return new Submit(data);
            case 'link':
                return new Link(data);
            case 'div':
                return new Div(data);
            default:
                return null;
        }
    }
}


// Tabla
export class Table extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        if (this.children.length === 0) {
            return `<table></table>`;
        }

        const titles = this.children.filter(child => child.type === 'title');
        const bodies = this.children.filter(child => child.type === 'body');

        const headers = titles.map(title => `<th>${title.text || ''}</th>`).join('');

        let bodyRows = '';

        if (bodies.length > 0) {
            const thresholdY = 15;
            const thresholdX = 15;

            // Agrupar por filas (eje Y)
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

            // Dentro de cada fila, ordenar por X y alinear con columnas
            bodyRows = rows.map(row => {
                // Ordenar por eje X
                row.sort((a, b) => {
                    const [x1] = a.loc.split(' ').map(Number);
                    const [x2] = b.loc.split(' ').map(Number);
                    return x1 - x2;
                });

                // Determinar posiciones X base desde titles
                const titleXPositions = titles.map(t => Number(t.loc.split(' ')[0]));

                // Alinear celdas con columnas usando tolerancia en eje X
                const cells = [];

                for (let i = 0; i < titles.length; i++) {
                    const titleX = titleXPositions[i];
                    const match = row.find(cell => {
                        const [x] = cell.loc.split(' ').map(Number);
                        return Math.abs(x - titleX) <= thresholdX;
                    });

                    if (match) {
                        cells.push(`<td>${match.text || ''}</td>`);
                    } else {
                        cells.push(`<td></td>`);
                    }
                }

                return `<tr>${cells.join('')}</tr>`;
            }).join('\n');
        }

        return `
<table>
    ${titles.length > 0 ? `<thead><tr>${headers}</tr></thead>` : ''}
    ${bodies.length > 0 ? `<tbody>${bodyRows}</tbody>` : ''}
</table>`;
    }
}

// Lista
export class List extends Base {
    constructor(data) {
        super(data);
    }
    render() {
        if (this.children.length === 0) {
            return `<ul></ul>`;
        }

        const items = this.children.map(child => {
            return `<li>${child.label || child.text || 'Ítem'}</li>`;
        }).join('\n');

        return `
<ul>
    ${items}
</ul>`;
    }
}

// Formulario
// export class Form extends Base {
//     constructor(data) {
//         super(data);
//     }

//     render() {
//         if (this.children.length === 0) {
//             return `<form></form>`;
//         }

//         const renderDivs = this.children.map(child => {
            
//             if (child.type === 'div') {
//                 const div = new Div(child);
//                 return div.render();
//             }
//             const instancia = this.instanciarElemento(child);
//             return instancia ? instancia.render() : '';
//         });

//         return `<form>${renderDivs.join('\n')}</form>`;
//     }

//     instanciarElemento(data) {
//         console.log('form hijo-------------',data.type);
//         switch (data.type) {
            
//             case 'texto':
//                 return new Texto(data);
//             case 'input':
//                 return new Input(data);
//             case 'submit':
//                 return new Submit(data);
//             case 'link':
//                 return new Link(data);
//             case 'div':
//                 return new Div(data);
//             default:
//                 return null;
//         }
//     }
// }

export class Div extends Base {
    constructor(data) {
        super(data);
    }
    render() {
        if (!this.children || this.children.length === 0) {
            return `<div></div>`;
        }

        const inner = this.children.map(child => {
            let instancia = null;
            console.log(child.type);
            
            switch (child.type) {
                
                case 'texto':
                    instancia = new Texto(child);
                    break;
                case 'number':
                    instancia = new Input(child);
                    break;
                case 'email':
                    instancia = new Input(child);
                    break;
                case 'password':
                    instancia = new Input(child);
                    break;
                case 'input':
                    instancia = new Input(child);
                    break;
                case 'select':
                    instancia = new Select(child);
                    break;
                case 'link':
                    instancia = new Link(child);
                    break;       
                    case 'form':
                        instancia = new Form(child);
                        break;                     
                    case 'div':
                        instancia = new Div(child);
                        break;

                default:
                    return '';
            }

            return instancia.render();
        }).join('\n');

        return `<div>${inner}</div>`;
    }
}

//✅
export class Texto extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const size = this.fontSize;
        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px; width:${this.width} `;

        let tag = 'h6';
        if (size >= 25) tag = 'h1';
        else if (size >= 20) tag = 'h2';
        else if (size >= 15) tag = 'h3';
        else if (size >= 10) tag = 'h4';
        else if (size >= 5) tag = 'h5';
        else tag = 'h6';

        return `<${tag} style="${style}" class="form-label">${this.text}</${tag}>`;
    }
}

export class Input extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const style = `position: absolute; top: ${this.y}px; left: ${this.x}px; width:${this.width};`;
        // return `<input type="${this.type}" placeholder="${this.text}"/>`;
        return `
        <input
            type="text"
            class="form-control"
            placeholder="${this.text}"
            style="${style}"    
        />`;
    }
}

// Botón
export class Button extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        return `<button style="${this.getStyle()}">${this.text}</button>`;
    }
}

// Select
export class Select extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        const options = (this.opciones || []).map(opt => `<option>${opt}</option>`).join("");
        return `<select  >${options}</select>`;
    }
}

// Enlace
export class Link extends Base {
    constructor(data) {
        super(data);
    }

    render() {
        return `<a href="#">${this.text}</a>`;
    }
}

//submit
export class Submit extends Base {
    constructor(data) {
        super(data);
    }
    render() {
        return `<button type="submit">${this.text}</button>`;
    }
}


function crearElementoDesdeData(data) {
    switch (data.type) {
        case 'lienzo':
            return new Lienzo(data);
        case 'nav':
            return new Nav(data);
        case 'table':
            return new Table(data);
        case 'list':
            return new List(data);
        case 'form':
            return new Form(data);
        case 'div':
        case 'custom':
            return new Div(data);
        case 'texto':
            return new Texto(data);
        case 'input':
        case 'text':
        case 'email':
        case 'number':
        case 'password':
            return new Input(data);
        case 'button':
            return new Button(data);
        case 'select':
            return new Select(data);
        case 'link':
            return new Link(data);
        default:
            return new Base(data); // Fallback
    }
}





export function buildTree(nodos) {
    // 1) Clonamos y pre-calculamos rectángulos
    const all = nodos.map(n => ({
      ...n,
      children: [],
      rect: (() => {
        const [x,y] = (n.loc  || "0 0").split(" ").map(Number);
        const [w,h] = (n.size || "1 1").split(" ").map(Number);
        return { x, y, w, h };
      })()
    }));
  
    // 2) Extraemos el lienzo (root)
    const root = all.find(n => n.type === 'lienzo');
    if (!root) throw new Error("No se encontró ningún nodo con type='lienzo'");
  
    // 3) Definimos qué es un contenedor (incluso renombrados)
const isContainer = n => {
  if (!n?.type || typeof n.type !== 'string') {
    console.warn("Nodo sin tipo válido:", n);
    return false;
  }
  const bases = ['nav','form','list','table','select'];
  return bases.some(base => n.type.startsWith(base));
};
  
    // 4) Separamos nodos:
    const containers = all.filter(n => n !== root && isContainer(n));
    const leaves     = all.filter(n => n !== root && !isContainer(n));
  
    // 5) Función para saber si A está dentro de B
    function isInside(a, b) {
      return (
        a.x   >= b.x &&
        a.y   >= b.y &&
        a.x+a.w <= b.x+b.w &&
        a.y+a.h <= b.y+b.h
      );
    }
  
    // 6) A cada contenedor le asignamos **todos** los nodos (contenedores y hojas)
    for (const C of containers) {
      const candidates = containers.concat(leaves);
      for (const nodo of candidates) {
        if (nodo === C) continue;
        if (isInside(nodo.rect, C.rect)) {
          C.children.push(nodo);
        }
      }
    }
  
    // 7) Determinamos los contenedores de primer nivel:
    //    aquellos que no caben dentro de ningún otro contenedor
    const topLevelContainers = containers.filter(C =>
      !containers.some(other =>
        other !== C && isInside(C.rect, other.rect)
      )
    );
  
    // 8) Determinamos las hojas sueltas:
    //    aquellas que no son contenedores y no están dentro de ningún contenedor
    const leavesInContainers = new Set(
      containers.flatMap(C => C.children)
    );
    const topLevelLeaves = leaves.filter(L =>
      !leavesInContainers.has(L)
    );
  
    // 9) Armamos el árbol bajo el lienzo
    root.children = [
      ...topLevelContainers,
      ...topLevelLeaves
    ];
  
    return root;
  }
  


const data = ["{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"key\":1,\"category\":\"custom\",\"type\":\"lienzo\",\"loc\":\"-5 -5\",\"color\":\"lightblue\",\"size\":\"1160 640\",\"label\":\"\"},\n{\"key\":2,\"category\":\"custom\",\"type\":\"nav\",\"loc\":\"-5 -5\",\"color\":\"lightblue\",\"size\":\"1160 70\",\"label\":\"\"},\n{\"key\":3,\"category\":\"rectangleTextNode\",\"loc\":\"725 5\",\"text\":\"home\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"button\",\"opciones\":[],\"validation\":[]},\n{\"key\":4,\"category\":\"rectangleTextNode\",\"loc\":\"935 5\",\"text\":\"about us\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"button\",\"opciones\":[],\"validation\":[]},\n{\"key\":5,\"category\":\"custom\",\"type\":\"form\",\"loc\":\"655 235\",\"color\":\"lightblue\",\"size\":\"200 300\",\"label\":\"\"},\n{\"key\":7,\"category\":\"custom\",\"type\":\"div\",\"loc\":\"655 275\",\"color\":\"lightblue\",\"size\":\"210 60\",\"label\":\"\"},\n{\"key\":-7,\"category\":\"text\",\"loc\":\"635 245\",\"text\":\"escribir username\",\"fontSize\":7,\"type\":\"texto\"},\n{\"key\":8,\"category\":\"rectangleTextNode\",\"loc\":\"675 285\",\"text\":\"username\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"input\",\"opciones\":[],\"validation\":[]}\n],\n  \"linkDataArray\": []}",{"text":"lienzo","key":1,"children":[{"text":"nav","key":2,"children":[{"text":"button","key":3,"children":[]},{"text":"button","key":4,"children":[]}]},{"text":"form","key":5,"children":[{"text":"div","key":7,"children":[{"text":"texto","key":-7,"children":[]},{"text":"input","key":8,"children":[]}]}]}]}]



const rawDiagramString = data[0];

const raw = JSON.parse(rawDiagramString);

const treeStructure = data[1];

function armarArbolConDatos(nodos, jerarquia) {
    const nodosPorKey = new Map(nodos.map(n => [n.key, n]));
  
    function construirNodoConHijos(nodoJerarquia) {
      const nodoReal = { ...nodosPorKey.get(nodoJerarquia.key) };
  
      // Si es select y tiene opciones, agregarlas como hijos
      if (nodoReal.type === "select" && Array.isArray(nodoReal.opciones)) {
        nodoReal.children = nodoReal.opciones.map(opcion => ({
          key: opcion,       // Clave igual al texto de la opción
          type: "opcion",
          text: opcion
        }));
      }
  
      // Si tiene hijos normales desde el árbol de jerarquía
      if (nodoJerarquia.children && nodoJerarquia.children.length > 0) {
        if (!nodoReal.children) nodoReal.children = [];
  
        nodoReal.children.push(
          ...nodoJerarquia.children.map(hijo => construirNodoConHijos(hijo))
        );
      }
  
      return nodoReal;
    }
  
    return construirNodoConHijos(jerarquia);
}
  
  
  
  

  
  const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, treeStructure);

console.log(JSON.stringify(nodosOrdenados, null, 2));
const html = crearElementoDesdeData(nodosOrdenados);
console.log(html.render());



// const nodos = renombrarTiposDuplicados(modelData);

// const tree = buildTree(nodos);
// console.dir(tree, { depth: null });

// const tree = construirArbol(modelData);
// console.dir(tree, { depth: null });

