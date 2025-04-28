<template>
    <div>
        <p>miebros sala</p>
        <li v-for="item in colaboradores">
            {{ item.usuario }}
        </li>

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

import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from 'vue-router'
import { DiagramManager } from "../class/DiagramManager.js";
import { useProyectosStore } from '@/stores/proyectos';
import { useAuthStore } from '@/stores/auth';
import { useSalaStore } from '@/stores/salas';
import { io } from "socket.io-client";



const route = useRoute()
const auth = useAuthStore();

const diagramRef = ref(null);
const codigo = ref(0);

const colaboradores = ref([]);

// websocket
let socket = null;



let diagramManager = null;

onMounted(async () => {

    codigo.value = route.params.codigo


    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("✅ Conectado al WebSocket");

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


const addCustomNode = () => {
    diagramManager.addNodeToDiagram("custom", { x: 300, y: 100 });
    const json = diagramManager.saveDiagram();
    socket.emit("add-node", {
        codigo: codigo.value,
        diagrama: json
    });

};





</script>
