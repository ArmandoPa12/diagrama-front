import { Base } from "./Base.js";
import { Form } from "./Form.js";
import { Lienzo } from "./Lienzo.js";
import { Table } from "./Table.js";
import { extraerNodosAngular, generarComponentTs } from "./TypeScritp.js";






function armarArbolConDatos(nodos, jerarquia) {
    const nodosPorKey = new Map(nodos.map(n => [n.key, n]));

    function construirNodoConHijos(nodoJerarquia) {
        const nodoReal = {...nodosPorKey.get(nodoJerarquia.key) };

        // Si es select y tiene opciones, agregarlas como hijos
        if (nodoReal.type === "select" && Array.isArray(nodoReal.opciones)) {
            nodoReal.children = nodoReal.opciones.map(opcion => ({
                key: opcion, // Clave igual al texto de la opción
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


const data = ["{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"key\":1,\"category\":\"custom\",\"type\":\"lienzo\",\"loc\":\"0 0\",\"color\":\"lightblue\",\"size\":\"1160 640\",\"label\":\"\"},\n{\"key\":2,\"category\":\"custom\",\"type\":\"form\",\"loc\":\"125 75\",\"color\":\"lightblue\",\"size\":\"330 490\",\"label\":\"\"},\n{\"key\":3,\"category\":\"text\",\"loc\":\"205 75\",\"text\":\"LOGIN\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":4,\"category\":\"text\",\"loc\":\"125 115\",\"text\":\"username\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":5,\"category\":\"rectangleTextNode\",\"loc\":\"165 165\",\"text\":\"username\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"text\",\"opciones\":[],\"validation\":[]},\n{\"key\":6,\"category\":\"text\",\"loc\":\"125 195\",\"text\":\"password\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":7,\"category\":\"rectangleTextNode\",\"loc\":\"165 245\",\"text\":\"password\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"password\",\"opciones\":[],\"validation\":[]},\n{\"key\":8,\"category\":\"text\",\"loc\":\"125 285\",\"text\":\"email\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":9,\"category\":\"rectangleTextNode\",\"loc\":\"155 335\",\"text\":\"email\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"email\",\"opciones\":[],\"validation\":[]},\n{\"key\":10,\"category\":\"rectangleTextNode\",\"loc\":\"175 495\",\"text\":\"enviar\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"submit\",\"opciones\":[],\"validation\":[]},\n{\"key\":11,\"category\":\"text\",\"loc\":\"115 385\",\"text\":\"Seleccionar letra\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":12,\"category\":\"rectangleTextNode\",\"loc\":\"155 425\",\"text\":\"letra\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"select\",\"opciones\":[\"a\",\"b\",\"c\",\"d\"],\"validation\":[]},\n{\"key\":13,\"category\":\"custom\",\"type\":\"div\",\"loc\":\"515 115\",\"color\":\"lightblue\",\"size\":\"210 440\",\"label\":\"\"},\n{\"key\":14,\"category\":\"custom\",\"type\":\"list\",\"loc\":\"555 155\",\"color\":\"lightblue\",\"size\":\"130 150\",\"label\":\"\"},\n{\"key\":15,\"category\":\"custom\",\"type\":\"list\",\"loc\":\"555 365\",\"color\":\"lightblue\",\"size\":\"130 150\",\"label\":\"\"},\n{\"key\":16,\"category\":\"text\",\"loc\":\"545 145\",\"text\":\"Nuevo Texto1\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":17,\"category\":\"text\",\"loc\":\"545 205\",\"text\":\"Nuevo Texto2\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":18,\"category\":\"text\",\"loc\":\"545 355\",\"text\":\"Nuevo Texto3\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":19,\"category\":\"text\",\"loc\":\"545 425\",\"text\":\"4\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":20,\"category\":\"custom\",\"type\":\"table\",\"loc\":\"795 135\",\"color\":\"lightblue\",\"size\":\"310 390\",\"label\":\"\"},\n{\"key\":21,\"category\":\"text\",\"loc\":\"825 155\",\"text\":\"title1\",\"fontSize\":10,\"type\":\"title\"},\n{\"key\":22,\"category\":\"text\",\"loc\":\"945 155\",\"text\":\"title2\",\"fontSize\":10,\"type\":\"title\"},\n{\"key\":23,\"category\":\"text\",\"loc\":\"825 245\",\"text\":\"body1\",\"fontSize\":10,\"type\":\"body\"},\n{\"key\":24,\"category\":\"text\",\"loc\":\"825 375\",\"text\":\"body2\",\"fontSize\":10,\"type\":\"body\"},\n{\"key\":25,\"category\":\"custom\",\"type\":\"nav\",\"loc\":\"0 0\",\"color\":\"lightblue\",\"size\":\"1160 70\",\"label\":\"\"},\n{\"key\":26,\"category\":\"rectangleTextNode\",\"loc\":\"175 15\",\"text\":\"home\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"button\",\"opciones\":[],\"validation\":[]},\n{\"key\":27,\"category\":\"rectangleTextNode\",\"loc\":\"315 15\",\"text\":\"services\",\"color\":\"lightgreen\",\"size\":\"80 30\",\"type\":\"button\",\"opciones\":[],\"validation\":[]},\n{\"key\":28,\"category\":\"rectangleTextNode\",\"loc\":\"815 575\",\"text\":\"pruebaA\",\"color\":\"lightgreen\",\"size\":\"130 150\",\"type\":\"button\",\"opciones\":[],\"validation\":[]},\n{\"key\":29,\"category\":\"rectangleTextNode\",\"loc\":\"955 575\",\"text\":\"pruebaB\",\"color\":\"lightgreen\",\"size\":\"130 150\",\"type\":\"button\",\"opciones\":[],\"validation\":[]}\n],\n  \"linkDataArray\": []}", { "text": "lienzo", "key": 1, "children": [{ "text": "form", "key": 2, "children": [{ "text": "texto", "key": 3, "children": [] }, { "text": "texto", "key": 4, "children": [] }, { "text": "input", "key": 5, "children": [] }, { "text": "texto", "key": 6, "children": [] }, { "text": "input", "key": 7, "children": [] }, { "text": "texto", "key": 8, "children": [] }, { "text": "input", "key": 9, "children": [] }, { "text": "submit", "key": 10, "children": [] }, { "text": "texto", "key": 11, "children": [] }, { "text": "input", "key": 12, "children": [] }] }, { "text": "div", "key": 13, "children": [{ "text": "list", "key": 14, "children": [{ "text": "texto", "key": 16, "children": [] }, { "text": "texto", "key": 17, "children": [] }] }, { "text": "list", "key": 15, "children": [{ "text": "texto", "key": 18, "children": [] }, { "text": "texto", "key": 19, "children": [] }] }] }, { "text": "table", "key": 20, "children": [{ "text": "texto", "key": 21, "children": [] }, { "text": "texto", "key": 22, "children": [] }, { "text": "texto", "key": 23, "children": [] }, { "text": "texto", "key": 24, "children": [] }] }, { "text": "nav", "key": 25, "children": [{ "text": "button", "key": 26, "children": [] }, { "text": "button", "key": 27, "children": [] }] }, { "text": "button", "key": 28, "children": [] }, { "text": "button", "key": 29, "children": [] }] }]



const rawDiagramString = data[0];

const raw = JSON.parse(rawDiagramString);

const treeStructure = data[1];

// console.log(JSON.stringify(nodosOrdenados, null, 2));

const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, treeStructure);

console.log(JSON.stringify(nodosOrdenados, null, 2));

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
            return new Base(data);
    }
}

const html = crearElementoDesdeData(nodosOrdenados);

const recopilacion = extraerNodosAngular(nodosOrdenados);
console.log(JSON.stringify(recopilacion, null, 2));
const TypeScritp = generarComponentTs(recopilacion);
console.log(TypeScritp);


console.log(html.render());