<template>
    <div>
        <input type="text" v-model="colaborador" name="colaborador" id="colaborador">
        <button @click="unirse">Unir colaborador</button>
        <p v-if="mensaje">{{ mensaje }}</p>
        <p>miebros sala</p>
        <li v-for="item in colaboradores">
            {{ item.usuario }}
        </li>

        <button @click="guardarDiagrama">Guardar</button>
        <button @click="addCustomNode">Agregar Custom</button>
        <div class="container">
            <p v-if="codigo">{{ codigo.value }}</p>
            <div ref="diagramRef" class="diagram"></div>
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
</style>

<script setup>

import { ref, onMounted, onBeforeUnmount, compile } from "vue";
import { useRoute } from 'vue-router'
import { DiagramManager } from "../class/DiagramManager.js";
import { useProyectosStore } from '@/stores/proyectos';
import { useAuthStore } from '@/stores/auth';
import { useSalaStore } from '@/stores/salas';
import { io } from "socket.io-client";



const route = useRoute()
const jsonData = ref("");
const proyecto = useProyectosStore();
const auth = useAuthStore();
const current = ref([]);
const sala = useSalaStore();

const diagramRef = ref(null);
//parametros
const codigo = ref(0);
const id = ref(0);

const colaborador = ref("");
const colaboradores = ref([]);
const mensaje = ref("");

// websocket
let socket = null;



let diagramManager = null;

onMounted(async () => {
    codigo.value = route.params.codigo
    id.value = Number(route.params.id);
    // await getCurrent();
    await getMiembros();


    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("✅ Conectado al WebSocket");

        // Te unes a una sala con el código de sala
        socket.emit("join-room", {
            codigo: codigo.value,
            usuario: auth.user.usuario,
        });

        socket.on("user-joined", (data) => {
            if (!colaboradores.value.some(col => col.usuario === data.usuario)) {
                colaboradores.value.push({ usuario: data.usuario });
            }
        });

        socket.on("load-diagram", (data) => {
            if (diagramRef.value) {
                diagramManager = new DiagramManager(diagramRef.value);
                diagramManager.loadDiagram(JSON.parse(data.payload));

                console.log("🧪 Llamando a setNodeMovedCallback");
                diagramManager.setNodeMovedCallback((json) => {
                    console.log("🧪 Callback ejecutado con:", json);
                    socket.emit("save-diagram", {
                        codigo: codigo.value,
                        diagrama: json
                    });
                });

            }
        });

        socket.on("update-diagram", (data) => {
            if (diagramRef.value) {
                diagramManager.loadDiagram(JSON.parse(data.payload.diagrama));
                // if (this.onNodeMoved) {
                //     this.setNodeMovedCallback(this.onNodeMoved);
                // }
            }
        });

    });
});

onBeforeUnmount(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
})

const getCurrent = async () => {
    current.value = await proyecto.getProyectoUno({
        userId: auth.user.id,
        proyectoId: id.value
    })
    jsonData.value = current.value.diagrama;
    cargarDiagrama();
}

const getMiembros = async () => {
    try {
        const lista = await sala.miembrosSala({
            proyectoId: id.value
        })
        colaboradores.value = lista;
        console.log(lista);
    } catch (error) {
        console.log(error)
    }


}


const addCustomNode = () => {
    diagramManager.addNodeToDiagram("custom", { x: 300, y: 100 });
    const json = diagramManager.saveDiagram();
    socket.emit("add-node", {
        codigo: codigo.value,
        diagrama: json
    });

};


const guardarDiagrama = async () => {
    if (diagramManager) {
        jsonData.value = diagramManager.saveDiagram();
        try {
            await proyecto.updateProyecto(
                { nombre: "prueba1", diagrama: jsonData.value },
                id.value);
            console.log('termiando');

            socket.emit("save-diagram", {
                codigo: codigo.value,
                diagrama: jsonData.value
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const cargarDiagrama = () => {
    if (diagramManager && jsonData.value) {
        diagramManager.loadDiagram(jsonData.value);
    } else {
        console.log('no entro a cagrgar')
    }
}

const unirse = async () => {
    if (!colaborador.value.trim()) {
        return;
    }

    console.log(colaborador.value)
    try {
        await sala.joinSala({
            usuario: colaborador.value,
            codigo: codigo.value,
        });
        mensaje.value = `usuario agregado a la sala ${colaborador.value}`;
    } catch (err) {
        mensaje.value = err.response.data.message;
    }
    colaborador.value = '';
}




</script>
