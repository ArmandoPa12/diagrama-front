<template>
    <div>
        <div v-if="esAnfitrion">
            <p>es anfitrion</p>
        </div>
        <div v-if="!esAnfitrion">
            <p>es colaborador</p>
        </div>

        <!-- <button @click="addCustomNode">Agregar nodo</button>
        <button @click="addinputNode">Agregar input</button>
        <button @click="addText">Agregar Texto</button>
        <button @click="addSelect">Agregar select</button>
        <button @click="deleteNode">Eliminar Nodo</button>
        <input type="number" v-model="fontSize" id="fontSize">
        <button @click="addTextSize">size Texto</button>
        <input type="color" v-model="color" id="colorPicker">
        <button @click="changeColorButton">Cambiar Color</button>
        <div class="color-grid">
            <div v-for="(savedColor, index) in colorHistory" :key="index" :style="{ backgroundColor: savedColor }"
                @click="color = savedColor">
            </div>
        </div>  -->

        <div v-if="esAnfitrion">
            <input v-model="colaborador" placeholder="Usuario a invitar" />
            <button @click="unirse">Unir usuario</button>

            <button id="popover-button" type="button" class="btn btn-secondary" data-bs-toggle="popover"
                data-bs-html="true" data-bs-trigger="hover" data-bs-placement="right">
                Colaboradores
            </button>
            <!-- <button @click="guardarDiagrama">Guardar</button>

            <p>{{ mensaje }}</p>
            <h3>Colaboradores:</h3>
            <ul>
                <li v-for="col in colaboradores" :key="col.usuario">{{ col.usuario }}</li>
            </ul> -->
        </div>
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
                                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li><button @click="addCustomNode('lienzo')"
                                            class="link-dark rounded">Lienzo</button></li>
                                    <li><button @click="addinputNode('input')" class="link-dark rounded">Input</button>
                                    </li>
                                    <li><button @click="addText()" class="link-dark rounded">Text</button></li>
                                    <li><button @click="addText('link', 'link')" class="link-dark rounded">link</button>
                                    </li>
                                    <li><button @click="addCustomNode('nav', { x: 1160, y: 70 })"
                                            class="link-dark rounded">Nav</button></li>
                                    <li><button @click="addCustomNode('form', { x: 200, y: 300 })"
                                            class="link-dark rounded">Formulario</button></li>
                                    <li><button @click="addCustomNode('list', { x: 130, y: 150 })"
                                            class="link-dark rounded">Lista</button></li>
                                    <li><button @click="addCustomNode('table', { x: 730, y: 390 })"
                                            class="link-dark rounded">Tabla</button></li>
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
                        </div>

                        <!-- <div v-if="selectedNode">

                            <p><strong> {{ selectedNode.type }}</strong></p>
                            <button class="link-dark rounded" @click="deleteNode">Eliminar</button>

                            <div  v-if="selectedNode.category === 'rectangleTextNode' && !selectedNode?.type === 'nav' " >                                
                                <select id="node-type"
                                    v-model="selectedNode.type" @change="updateNodeType">
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="email">Email</option>
                                    <option value="password">Password</option>
                                    <option value="select">Select</option>
                                </select>
                            </div>

                            <input type="color" v-model="color" id="colorPicker">
                            <a class="badge text-bg-light rounded-pill" @click="changeColorButton">Cambiar color</a>

                            <div v-if="selectedNode?.type === 'select'">
                                <div v-for="(item, index) in valores" :key="index" class="mb-2 d-flex">
                                    <input v-model="valores[index]" type="text" class="form-control me-2"
                                        placeholder="Opción" />
                                </div>
                                <button @click="agregarCampo" class="btn btn-success me-2" type="button">+</button>
                                <button @click="updateNodeType" class="btn btn-primary" type="button">Confirmar</button>
                            </div>

                            <div v-if="selectedNode?.type === 'nav'">
                                agregar boton
                                <button @click="addinputNode('button')" class="link-dark rounded">+Boton</button>
                            </div>


                        </div> -->
                    </ul>
                </div>
                <div class="col-1 p-3" >
                    <!-- <ArbolJerarquico :arbolJerarquico="arbolJerarquico" @update="guardarCambios" /> -->
                </div>
                <div class="col-10 p-3">
                    <div ref="diagramRef" style="width: 100%; height: 670px; border: 1px solid #ccc"></div>
                </div>
            </div>
        </div>

        <!-- <div ref="diagramRef" style="width:100%; height:500px; border: 1px solid #ccc;"></div> -->


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
</style>

<script setup>

import { ref, onMounted, onBeforeUnmount, compile, watch } from "vue";
import { useRoute } from 'vue-router'
import { DiagramManager } from "../class/DiagramManager.js";
import { useProyectosStore } from '@/stores/proyectos';
import { useAuthStore } from '@/stores/auth';
import { useSalaStore } from '@/stores/salas';
import { io } from "socket.io-client";
import * as bootstrap from 'bootstrap'
import { agregarNodoAlArbol,eliminarNodoDelArbol } from '@/auxiliar/Arbol.js';
// import TreeView from "@/components/TreeView.vue";


const route = useRoute()
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
let popoverInstance = null
const arbolJerarquico = ref();
// websocket
let socket = null;



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
        console.log("✅ Conectado al WebSocket");

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
            if (diagramRef.value) {
                diagramManager = new DiagramManager(diagramRef.value, (nodeData) => {
                    selectedNode.value = nodeData
                });
                diagramManager.loadDiagram(JSON.parse(data.payload));

                // console.log("🧪 Llamando a setNodeMovedCallback");
                diagramManager.setNodeMovedCallback((json) => {
                    // console.log("🧪 Callback ejecutado con:", json);
                    socket.emit("save-diagram", {
                        codigo: codigoSala.value,
                        diagrama: json
                    });
                });

            }
        });
        socket.on("update-diagram", (data) => {
            if (diagramRef.value) {
                diagramManager.loadDiagram(JSON.parse(data.payload.diagrama));

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
    if (newNode?.type === 'select' && Array.isArray(newNode.valores)) {
        valores.value = [...newNode.valores]
    } else {
        valores.value = []
    }
})

const getMiembros = async () => {
    try {
        const lista = await sala.miembrosSala({
            proyectoId: idProyecto.value
        })
        colaboradores.value = lista;
        console.log(lista);
    } catch (error) {
        console.log(error)
    }


}
function guardarCambios(nuevoArbol) {
  console.log('Árbol actualizado con drag-and-drop:', nuevoArbol);
  // Aquí podrías emitir por socket o guardar en tu backend
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
        // No hay nodo seleccionado, lo tomamos como raíz
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
        console.log("Nodo raíz creado:", JSON.stringify(arbolJerarquico.value, null, 2));
    } else {
        const agregado = agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
        if (agregado) {
            console.log("Nodo agregado como hijo:", JSON.stringify(arbolJerarquico.value, null, 2));
        } else {
            console.warn("No se encontró el nodo padre para agregar el hijo.");
        }
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
        // No hay nodo seleccionado, lo tomamos como raíz
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
        console.log("Nodo raíz creado:", JSON.stringify(arbolJerarquico.value, null, 2));
    } else {
        const agregado = agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
        if (agregado) {
            console.log("Nodo agregado como hijo:", JSON.stringify(arbolJerarquico.value, null, 2));
        } else {
            console.warn("No se encontró el nodo padre para agregar el hijo.");
        }
    }
    emitir(json);
};

const deleteNode = () => {
    const respuesta = diagramManager.deleteSelectedNode();

    eliminarNodoDelArbol(arbolJerarquico,respuesta.data.key);
    JSON.stringify(arbolJerarquico.value, null, 2)
    

};
const addText = (tipo = "text", text = "Nuevo Texto") => {
    const newNodeData =diagramManager.addTextNode(tipo, text);
    const json = diagramManager.saveDiagram();
    emitir(json);

    const nuevoNodo = {
        text: 'text',
        key: newNodeData.key,
        children: []
    };
    if (!selectedNode.value) {
        // No hay nodo seleccionado, lo tomamos como raíz
        agregarNodoAlArbol(arbolJerarquico, null, nuevoNodo);
        console.log("Nodo raíz creado:", JSON.stringify(arbolJerarquico.value, null, 2));
    } else {
        const agregado = agregarNodoAlArbol(arbolJerarquico, selectedNode.value.key, nuevoNodo);
        if (agregado) {
            console.log("Nodo agregado como hijo:", JSON.stringify(arbolJerarquico.value, null, 2));
        } else {
            console.warn("No se encontró el nodo padre para agregar el hijo.");
        }
    }
};

const emitir = (json) => {
    socket.emit("add-node", {
        codigo: codigoSala.value,
        diagrama: json
    });
}

function updateNodeType() {
    if (selectedNode.value) {
        diagramManager.diagram.model.startTransaction('update type')
        diagramManager.diagram.model.setDataProperty(selectedNode.value, 'type', selectedNode.value.type)

        if (selectedNode.value.type === 'select') {
            diagramManager.diagram.model.setDataProperty(selectedNode.value, 'opciones', [...valores.value]);
        } else {
            valores.value = [''];
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

const guardarDiagrama = async () => {
    if (diagramManager) {
        jsonData.value = diagramManager.saveDiagram();
        console.log(jsonData.value);
        try {
            await proyecto.updateProyecto(
                { nombre: "prueba1", diagrama: jsonData.value },
                idProyecto.value);
            console.log('termiando');

            socket.emit("save-diagram", {
                codigo: codigoSala.value,
                diagrama: jsonData.value
            });
        } catch (error) {
            console.log(error);
        }
    }
}

// const cargarDiagrama = () => {
//     if (diagramManager && jsonData.value) {
//         diagramManager.loadDiagram(jsonData.value);
//     } else {
//         console.log('no entro a cagrgar')
//     }
// }

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
