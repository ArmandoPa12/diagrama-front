<template>
    <div>
        <div class="controls">
            <!-- <button @click="addCircleNode">Agregar Círculo</button>
            <button @click="addRectangleNode">Agregar Rectángulo</button> -->
            <button @click="guardarDiagrama">Guardar</button>
            <button @click="addinputNode">Agregar input</button>
            <button @click="addCustomNode">Agregar Custom</button>
            <button @click="clearDiagram">Limpiar Diagrama</button>
            <br>
            <button @click="addText">Agregar Texto</button>
            <input type="number" v-model="fontSize" id="fontSize">
            <button @click="addTextSize">size Texto</button>


            <button @click="deleteNode">Eliminar Nodo</button>
            <br>
            <input type="color" v-model="color" id="colorPicker">
            <button @click="changeColorButton">Cambiar Color</button>
            <div v-if="!colaboracionHabilitada">
            <button @click="habilitarColaboracion">Habilitar colaboración en tiempo real</button>
            </div>
            <div class="color-grid">
                <div v-for="(savedColor, index) in colorHistory" 
                     :key="index" 
                     :style="{ backgroundColor: savedColor }" 
                     @click="color = savedColor">
                </div>
            </div>
        </div>
        <div class="container">

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
    height: 400px;
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

import { ref, onMounted } from "vue";
import { DiagramManager } from "../class/DiagramManager.js";




const diagramRef = ref(null);
const paletteRef = ref(null);
const color = ref("#000000");
const colorHistory = ref([]);
const jsonData = ref("");
const fontSize = ref(20);

const colaboracionHabilitada = ref(false);


let diagramManager = null;
let socket = null; 

onMounted(() => {
    if (diagramRef.value) {
        diagramManager = new DiagramManager(diagramRef.value);
    }
});

const guardarDiagrama = async () => {
    if (diagramManager) {
        jsonData.value = diagramManager.saveDiagram();
        console.log(jsonData.value);
        // try {
        //     await proyecto.updateProyecto(
        //         { nombre: "prueba1", diagrama: jsonData.value },
        //         id.value);
        //     console.log('termiando');

        //     socket.emit("save-diagram", {
        //         codigo: codigo.value,
        //         diagrama: jsonData.value
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    }
}

const saveColor = () => {
    if (!colorHistory.value.includes(color.value)) {
        if (colorHistory.value.length >= 24) {
            colorHistory.value.shift();
        }
        colorHistory.value.push(color.value);
    }
};
const addCustomNode = () => {
    diagramManager.addNodeToDiagram("custom", { x: 300, y: 100 });
};
const addinputNode = () => {
    diagramManager.addRectangleTextNode("custom", { x: 100, y: 100 });
};
const addText = () => {
    diagramManager.addTextNode();
};
const deleteNode = () => {
    diagramManager.deleteSelectedNode();
};
const changeColorButton = () => {
    const selectedNode = diagramManager.getSelectedNode();
    if (selectedNode.category == 'custom'){
        diagramManager.changeNodeColor(color.value);
    }
    if (selectedNode.category == 'text'){
        diagramManager.changeNodeTextFontColor(color.value);
    }
    if (selectedNode.category == 'rectangleTextNode'){
        diagramManager.changeNodeColor(color.value);
    }

    saveColor();
};
const addTextSize = () => {
    diagramManager.changeNodeTextFontZise(fontSize.value);
};

// Método para limpiar el diagrama
const clearDiagram = () => {
    diagramManager.clearDiagram();
};

</script>
