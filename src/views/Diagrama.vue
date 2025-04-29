<template>
    <div>
        <div v-if="esAnfitrion">
            <p>es anfitrion</p>
        </div>
        <div v-if="!esAnfitrion">
            <p>es colaborador</p>
        </div>

        <div class="row row-cols-auto p-2" >
            <div class="col">
                <button type="button" @click="goBack" class="btn btn-primary me-2"><</button>
            </div>

            <div class="col">
                <div v-if="tituloProyecto">
                    <h3>Proyecto: {{ tituloProyecto }}</h3>
                </div>

            </div>
        </div>


        <div v-if="esAnfitrion">
            <input v-model="colaborador" placeholder="Usuario a invitar" />
            <button @click="unirse">Unir usuario</button>

            <button id="popover-button" type="button" class="btn btn-secondary" data-bs-toggle="popover"
                data-bs-html="true" data-bs-trigger="hover" data-bs-placement="right">
                Colaboradores
            </button>

        </div>
        <button @click="generarPaquete">Generar paquete</button>
        <div class="container-fluid">
            <div class="row">
                <div class="col-1 p-3 bg-light border-end">
                    <ul class="list-unstyled ps-0">
                        <li class="mb-1">
                            <button>
                                <span class="badge text-bg-primary rounded-pill" data-bs-toggle="collapse"
                                    data-bs-target="#home-collapse" aria-expanded="false">Primary</span>
                            </button>

                            <div class="collapse" id="home-collapse" style="">
                                <ul class="btn-toggle-nav list-unstyled fw-normal p-1 small">
                                    <li><button @click="addCustomNode('lienzo')"
                                            class="link-dark rounded p-1">Lienzo</button></li>
                                    <li><button @click="addinputNode('input')" class="link-dark rounded">Input</button>
                                    </li>
                                    <li><button @click="addText()" class="p-1 link-dark rounded">Text</button></li>
                                    <li><button @click="addinputNode('button', { x: 130, y: 150 })"
                                            class="link-dark rounded p-1">Boton</button></li>
                                    <li><button @click="addText('link', 'link')"
                                            class="p-1 link-dark rounded">link</button>
                                    </li>
                                    <li><button @click="addCustomNode('nav', { x: 1160, y: 70 })"
                                            class="link-dark rounded p-1">Nav</button></li>
                                    <li><button @click="addCustomNode('form', { x: 200, y: 300 })"
                                            class="link-dark rounded p-1">Formulario</button></li>
                                    <li><button @click="addCustomNode('list', { x: 130, y: 150 })"
                                            class="link-dark rounded p-1">Lista</button></li>
                                    <li><button @click="addCustomNode('table', { x: 730, y: 390 })"
                                            class="link-dark rounded p-1">Tabla</button></li>
                                    <li><button @click="addCustomNode('div', { x: 210, y: 60 })"
                                            class="link-dark rounded p-1">Div</button></li>
                                </ul>
                            </div>

                        </li>
                        <li class="border-top my-3"></li>

                        <div v-if="selectedNode">
                            <!-- Mostrar el tipo del nodo -->
                            <p><strong>{{ selectedNode.type }}</strong></p>
                            <button class="link-dark rounded" @click="deleteNode">Eliminar</button>

                            <!-- Mostrar el select solo si es rectangleTextNode y no es tipo 'nav' ni 'button' -->
                            <div v-if="
                                selectedNode.category === 'rectangleTextNode' &&
                                selectedNode.type !== 'nav' &&
                                selectedNode.type !== 'button' &&
                                selectedNode.type !== 'submit'
                            ">
                                <select id="node-type" v-model="selectedNode.type" @change="updateNodeType">
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="email">Email</option>
                                    <option value="password">Password</option>
                                    <option value="select">Select</option>
                                </select>
                            </div>

                            <!-- Picker de color: siempre visible -->
                            <input type="color" v-model="color" id="colorPicker" />
                            <a class="badge text-bg-light rounded-pill" @click="changeColorButton">Cambiar color</a>
                            <div v-if="selectedNode.category === 'text'">
                                texto
                                <input type="number" v-model="fontSize" id="fontSize">
                                <button @click="addTextSize">size Texto</button>
                            </div>
                            <!-- Si el tipo es 'select', mostrar campos para opciones -->
                            <div v-if="selectedNode.type === 'select'">
                                <div v-for="(item, index) in valores" :key="index" class="mb-2 d-flex">
                                    <input v-model="valores[index]" type="text" class="form-control me-2"
                                        placeholder="Opción" />
                                </div>
                                <button @click="agregarCampo" class="btn btn-success me-2" type="button">+</button>
                                <button @click="updateNodeType" class="btn btn-primary" type="button">Confirmar</button>
                            </div>

                            <!-- Si el tipo es 'nav', permitir agregar botones -->
                            <div v-if="selectedNode.type === 'nav'">
                                <button @click="addinputNode('button', { x: 80, y: 30 }, 'boton nav')"
                                    class="link-dark rounded">+Boton</button>
                            </div>

                            <div v-if="selectedNode.type === 'form'">
                                <button @click="addinputNode('submit', { x: 80, y: 30 }, 'submit')"
                                    class="link-dark rounded">+Submit</button>
                            </div>
                            <div v-if="selectedNode.type === 'table'">
                                <button @click="addText('title', 'title')"
                                    class="link-dark rounded me-2">Titulo+</button>
                                <button @click="addText('body', 'body')" class="link-dark rounded">body+</button>
                            </div>
                        </div>
                    </ul>
                </div>
                <div class="col-2 p-3">
                    <div v-if="arbolJerarquico" class="arbol-visual">
                        <pre>{{ formatearArbol(arbolJerarquico) }}</pre>
                    </div>
                </div>
                <div class="col-9 p-3">
                    <div ref="diagramRef" style="width: 100%; height: 670px; border: 1px solid #ccc"></div>
                </div>
            </div>
        </div>


    </div>
</template>

<style>
.palette {
    width: 150px;
    height: 400px;
}

.diagram {
    flex-grow: 1;
    height: 550px;
    border: 1px solid #ccc;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(6, 30px);
    grid-template-rows: repeat(4, 30px);
    gap: 5px;
    margin-top: 10px;
}

.color-grid div {
    width: 30px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #ccc;
}

.arbol-visual {
    font-family: monospace;
    text-align: left;
    white-space: pre;
    background-color: #f8f8f8;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
}
</style>

<script setup>

import { ref, onMounted, onBeforeUnmount, compile, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { DiagramManager } from "../class/DiagramManager.js";
import { useProyectosStore } from '@/stores/proyectos';
import { useAuthStore } from '@/stores/auth';
import { useSalaStore } from '@/stores/salas';
import { io } from "socket.io-client";
import * as bootstrap from 'bootstrap'
import { agregarNodoAlArbol, eliminarNodoDelArbol } from '@/auxiliar/Arbol.js';
import { extraerNodosAngular, generarComponentTs, armarArbolConDatos, crearElementoDesdeData, generarRoutingTs, generarModuleTs } from "../class/convertir/TypeScritp.js";
import JSZip from 'jszip';



const route = useRoute()
const router = useRouter()
const codigoSala = ref(route.params.codigo);
const idProyecto = ref(Number(route.params.id));
const esAnfitrion = ref(!!route.params.id);


const jsonData = ref("");
const proyecto = useProyectosStore();
const auth = useAuthStore();
const sala = useSalaStore();

const diagramRef = ref(null);
//parametros
const idSala = ref(0);

const colaborador = ref("");
const colaboradores = ref([]);
const mensaje = ref("");
const fontSize = ref(20);
const color = ref("#000000");
const colorHistory = ref([]);
const selectedType = ref('Ninguno')
const selectedNode = ref(null)
const valores = ref([''])
const tituloProyecto = ref('');
let popoverInstance = null
const arbolJerarquico = ref();
// websocket
let socket = null;
let inicializado = false;


let diagramManager = null;

onMounted(async () => {
    if (esAnfitrion.value) {
        await getMiembros();
    }
    const trigger = document.getElementById('popover-button')
    if (trigger) {
        popoverInstance = new bootstrap.Popover(trigger, {
            content: generarContenidoHTML(),
            html: true,
            trigger: 'hover',
            placement: 'right'
        })
    }


    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("Conectado al WebSocket");

        socket.emit("join-room", {
            codigo: codigoSala.value,
            usuario: auth.user.usuario,
        });

        socket.on("user-joined", (data) => {
            if (!colaboradores.value.some(col => col.usuario === data.usuario)) {
                colaboradores.value.push({ usuario: data.usuario });
            }
        });

        socket.on("load-diagram", (data) => {

            if (inicializado) return;
            tituloProyecto.value = data.data.nombre || '';

            const arbol = JSON.parse(data.payload)[1]
            const diagramaRaw = JSON.parse(data.payload)[0]


            if (diagramRef.value) {
                diagramManager = new DiagramManager(diagramRef.value, (nodeData) => {
                    selectedNode.value = nodeData
                });
                diagramManager.loadDiagram(diagramaRaw);
                diagramManager.setNodeMovedCallback((json) => {
                    socket.emit("save-diagram", {
                        codigo: codigoSala.value,
                        diagrama: [json, arbolJerarquico.value]
                    });
                });

            }


            if (arbol) {
                arbolJerarquico.value = arbol
            }
            inicializado = true;
        });
        socket.on("update-diagram", (data) => {
            const model = JSON.parse(data.payload.diagrama)
            if (diagramRef.value) {
                diagramManager.loadDiagram(model[0]);
                arbolJerarquico.value = model[1];
            }
        });

    });
});

onBeforeUnmount(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
    generarImagenDelDiagrama();
})


const generarPaquete = () => {
    console.log('paquete generado');
    const a = diagramManager.saveDiagram();
    const raw = JSON.parse(a);
    const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, arbolJerarquico.value);
    const hijos = extraerNodosAngular(nodosOrdenados);

    // aqui tenemos el html
    const html = crearElementoDesdeData(nodosOrdenados);
    // aqui tenemos el comoponente
    const componente = generarComponentTs(hijos, tituloProyecto.value);
    //aqui van los modulos
    const modulos = generarModuleTs(tituloProyecto.value);
    // aqui enemos el routin
    const routing = generarRoutingTs(tituloProyecto.value);

    const nombreBase = tituloProyecto.value
    const archivos = [
        { nombre: nombreBase + '.component.ts', contenido: componente },
        { nombre: nombreBase + '.component.html', contenido: html.render() },
        { nombre: nombreBase + '.module.ts', contenido: modulos },
        { nombre: nombreBase + '.component.css', contenido: '' },
        { nombre: nombreBase + '-routing.module.ts', contenido: routing },
    ];

    generarZip(nombreBase, archivos);

}

async function generarZip(nombreProyecto, archivos) {
    const zip = new JSZip();

    for (const archivo of archivos) {
        zip.file(archivo.nombre, archivo.contenido);
    }
    const contenidoZip = await zip.generateAsync({ type: 'blob' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(contenidoZip);
    enlace.download = `${nombreProyecto}.zip`;
    enlace.style.display = 'none';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

const formatearArbol = (nodo, nivel = 0) => {
    if (!nodo) return '';

    const indentacion = '    '.repeat(nivel);
    const flechas = nivel > 0 ? '-->' : '';
    let resultado = `${indentacion}${flechas}${nodo.text}\n`;

    if (nodo.children && nodo.children.length > 0) {
        for (const hijo of nodo.children) {
            resultado += formatearArbol(hijo, nivel + 1);
        }
    }

    return resultado;
};

const generarContenidoHTML = () => {
    return `
    <ul class="list-unstyled mb-0">
      ${colaboradores.value.map(col => `<li>${col.usuario}</li>`).join('')}
    </ul>
  `
}

function agregarCampo() {
    if (valores.value[valores.value.length - 1] !== '') {
        valores.value.push('')
    }
}

watch(selectedNode, (newNode) => {
    if (newNode?.type === 'select' && Array.isArray(newNode.opciones)) {
        valores.value = [...newNode.opciones];
    } else {
        valores.value = [];
    }
});

const getMiembros = async () => {
    try {
        const lista = await sala.miembrosSala({
            proyectoId: idProyecto.value
        })
        colaboradores.value = lista;
    } catch (error) {
        console.log(error)
    }


}

const addTextSize = () => {
    const newNodeData = diagramManager.changeNodeTextFontZise(fontSize.value)
    const json = diagramManager.saveDiagram();
    emitir(json);
}

const addCustomNode = (valor, size = { x: 1160, y: 640 }, pos = { x: 0, y: 0 }) => {
    const newNodeData = diagramManager.addNodeToDiagram(valor, size, pos);
    const json = diagramManager.saveDiagram();

    const nuevoNodo = {
        text: valor,
        key: newNodeData.key,
        children: []
    };
    if (!selectedNode.value) {
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
    } else {
        agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
    }

    emitir(json);
};
const addinputNode = (valor = "text", size = { x: 80, y: 30 }, text = "input", pos = { x: 0, y: 0 }) => {
    console.log(text);

    const newNodeData = diagramManager.addRectangleTextNode(valor, size, text, pos);
    const json = diagramManager.saveDiagram();
    const nuevoNodo = {
        text: valor,
        key: newNodeData.key,
        children: []
    };
    if (!selectedNode.value) {
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
    } else {
        agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
    }
    emitir(json);
};

const deleteNode = () => {
    const respuesta = diagramManager.deleteSelectedNode();
    eliminarNodoDelArbol(arbolJerarquico, respuesta.data.key);
};


const addText = (tipo = "texto", text = "Nuevo Texto") => {
    const newNodeData = diagramManager.addTextNode(tipo, text);
    const json = diagramManager.saveDiagram();
    emitir(json);

    const nuevoNodo = {
        text: 'texto',
        key: newNodeData.key,
        children: []
    };
    if (!selectedNode.value) {
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
    } else {
        agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
    }
};

const emitir = (json) => {
    socket.emit("add-node", {
        codigo: codigoSala.value,
        diagrama: [json, arbolJerarquico.value]
    });
}

const goBack =() => {
    router.back();
}

function updateNodeType() {
    if (selectedNode.value) {
        diagramManager.diagram.model.startTransaction('update type')
        diagramManager.diagram.model.setDataProperty(selectedNode.value, 'type', selectedNode.value.type)

        if (selectedNode.value.type === 'select') {
            diagramManager.diagram.model.setDataProperty(selectedNode.value, 'opciones', [...valores.value]);
            console.log('if true');

        } else {
            valores.value = [''];
            console.log('if false');

            diagramManager.diagram.model.setDataProperty(selectedNode.value, 'opciones', []);
        }
        diagramManager.diagram.model.commitTransaction('update type')
    }

}


const changeColorButton = () => {
    const selectedNode = diagramManager.getSelectedNode();
    if (selectedNode.category == 'custom') {
        diagramManager.changeNodeColor(color.value);
    }
    if (selectedNode.category == 'text') {
        diagramManager.changeNodeTextFontColor(color.value);
    }
    if (selectedNode.category == 'rectangleTextNode') {
        diagramManager.changeNodeColor(color.value);
    }

    saveColor();
};

const saveColor = () => {
    if (!colorHistory.value.includes(color.value)) {
        if (colorHistory.value.length >= 24) {
            colorHistory.value.shift();
        }
        colorHistory.value.push(color.value);
    }
};

const unirse = async () => {
    if (!colaborador.value.trim()) {
        return;
    }

    console.log(colaborador.value)
    try {
        await sala.joinSala({
            usuario: colaborador.value,
            codigo: codigoSala.value,
        });
        mensaje.value = `usuario agregado a la sala ${colaborador.value}`;
    } catch (err) {
        mensaje.value = err.response.data.message;
    }
    colaborador.value = '';
}

async function generarImagenDelDiagrama() {
    if (!diagramManager) {
        console.warn('No hay instancia de diagramManager');
        return;
    }

    const imageDataUrl = diagramManager.getDiagramImageData();
    if (!imageDataUrl) {
        console.warn('No se pudo generar la imagen del diagrama');
        return;
    }

    const imagenFile = dataURLToFile(imageDataUrl, 'diagrama.png');

    const formData = new FormData();
    formData.append('imagenData', imagenFile);

    try {
        await proyecto.cerrarProyecto(formData, idProyecto.value);
        console.log('Imagen enviada correctamente');
    } catch (err) {
        console.error('Error al enviar la imagen generada:', err);
    }
}

function dataURLToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


</script>
