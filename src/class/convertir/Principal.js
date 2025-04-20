import { Base } from "./Base.js";
import { Input } from "./Input.js";
import { Lienzo } from "./Lienzo.js";
import { Text } from "./Text.js";


function createNode(data) {
    switch (data.category) {
        case "custom":
            return new Lienzo(data);
        case "rectangleTextNode":
            return new Input(data);
        case "text":
            return new Text(data);
            // Cuando agregues más categorías, las registras aquí
        default:
            console.warn("Categoría desconocida:", data.category);
            return new Base(data);
    }
}
function renombrarTiposDuplicados(nodos) {
    const typeCounter = {};
  
    for (const nodo of nodos) {
      if (!nodo.type) continue;
  
      const tipoBase = nodo.type;
      if (!typeCounter[tipoBase]) {
        typeCounter[tipoBase] = 1;
      } else {
        typeCounter[tipoBase]++;
        nodo.type = `${tipoBase}${typeCounter[tipoBase]}`;
      }
    }
  
    return nodos;
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
const modelData = [
    {"key":1,"category":"custom","type":"lienzo","loc":"0 0","color":"lightblue","size":"1160 640","label":""},
    {"key":6,"category":"custom","type":"nav","loc":"5 5","color":"lightblue","size":"1150 70","label":""},
    {"key":7,"category":"rectangleTextNode","loc":"155 15","text":"home","color":"lightgreen","size":"80 30","type":"button","opciones":[],"validation":[]},
    {"key":4,"category":"custom","type":"table","loc":"75 145","color":"lightblue","size":"560 300","label":""},
    {"key":5,"category":"text","loc":"145 135","text":"columna1","fontSize":10},
    {"key":-6,"category":"text","loc":"265 135","text":"columna2","fontSize":10},
    {"key":-7,"category":"text","loc":"395 135","text":"columna3","fontSize":10},
    {"key":-8,"category":"text","loc":"515 135","text":"columna4","fontSize":10},
    {"key":-9,"category":"text","loc":"55 205","text":"fila1","fontSize":10},
    {"key":-10,"category":"text","loc":"55 285","text":"fila2","fontSize":10},
    {"key":-11,"category":"text","loc":"55 365","text":"fila3","fontSize":10},
    {"key":12,"category":"custom","type":"form","loc":"795 125","color":"lightblue","size":"320 500","label":""},
    {"key":13,"category":"text","loc":"875 125","text":"Formulario","fontSize":10},
    {"key":14,"category":"rectangleTextNode","loc":"845 215","text":"nombre","color":"lightgreen","size":"80 30","type":"text","opciones":[],"validation":[]},
    {"key":-15,"category":"rectangleTextNode","loc":"835 285","text":"edad","color":"lightgreen","size":"80 30","type":"number","opciones":[],"validation":[]},
    {"key":-16,"category":"rectangleTextNode","loc":"835 365","text":"carnet","color":"lightgreen","size":"80 30","type":"number","opciones":[],"validation":[]},
    {"key":-17,"category":"rectangleTextNode","loc":"835 435","text":"email","color":"lightgreen","size":"80 30","type":"email","opciones":[],"validation":[]},
    {"key":-18,"category":"text","loc":"815 165","text":"nombre","fontSize":10},
    {"key":-19,"category":"text","loc":"805 245","text":"edad","fontSize":10},
    {"key":-20,"category":"text","loc":"805 315","text":"carnet","fontSize":10},
    {"key":-21,"category":"text","loc":"805 385","text":"email","fontSize":10},
    {"key":-22,"category":"rectangleTextNode","loc":"845 515","text":"password","color":"lightgreen","size":"80 30","type":"email","opciones":[],"validation":[]},
    {"key":-23,"category":"text","loc":"805 465","text":"password","fontSize":10},
    {"key":24,"category":"rectangleTextNode","loc":"1005 515","text":"submit","color":"lightgreen","size":"80 30","type":"submit","opciones":[],"validation":[]},
    {"key":25,"category":"text","loc":"795 555","text":"olvidaste tu contrasena","fontSize":7},
    {"key":-26,"category":"rectangleTextNode","loc":"275 15","text":"services","color":"lightgreen","size":"80 30","type":"button","opciones":[],"validation":[]},
    {"key":-27,"category":"rectangleTextNode","loc":"395 15","text":"products","color":"lightgreen","size":"80 30","type":"button","opciones":[],"validation":[]},
    {"key":-28,"category":"rectangleTextNode","loc":"525 15","text":"about us","color":"lightgreen","size":"80 30","type":"button","opciones":[],"validation":[]},
    {"key":-29,"category":"rectangleTextNode","loc":"685 15","text":"contact us","color":"lightgreen","size":"80 30","type":"button","opciones":[],"validation":[]},
    {"key":30,"category":"text","loc":"905 555","text":"recuperar contra","fontSize":8,"type":"link","textColor":"#004cff"},
    {"key":31,"category":"custom","type":"list","loc":"85 465","color":"lightblue","size":"130 150","label":""},
    {"key":32,"category":"text","loc":"75 475","text":"manzana","fontSize":8,"type":"text"},
    {"key":-33,"category":"text","loc":"75 505","text":"pera","fontSize":8,"type":"text"},
    {"key":-34,"category":"text","loc":"75 535","text":"limon","fontSize":8,"type":"text"},
    {"key":35,"category":"rectangleTextNode","loc":"985 365","text":"Continentes","color":"lightgreen","size":"80 30","type":"select","opciones":["america","asia","europa","africa"],"validation":[]}
];


const nodos = renombrarTiposDuplicados(modelData);

const tree = buildTree(nodos);
console.dir(tree, { depth: null });

// const tree = construirArbol(modelData);
// console.dir(tree, { depth: null });

