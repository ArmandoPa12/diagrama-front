<template>
    <div>
        <div class="controls">
            <!-- <button @click="addCircleNode">Agregar Círculo</button>
            <button @click="addRectangleNode">Agregar Rectángulo</button> -->
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
</style>

<script setup>

import { ref, onMounted } from "vue";
import { DiagramManager } from "../class/DiagramManager.js";



const diagramRef = ref(null);
const paletteRef = ref(null);
const color = ref(null);
const fontSize = ref(20);


let diagramManager = null;

onMounted(() => {
    if (diagramRef.value) {
        diagramManager = new DiagramManager(diagramRef.value);
    }
});


const addCustomNode = () => {
    diagramManager.addNodeToDiagram("custom", { x: 300, y: 100 });
};
const addinputNode = () => {
    // diagramManager.addInputNode("custom", { x: 100, y: 100 });
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
};
const addTextSize = () => {
    diagramManager.changeNodeTextFontZise(fontSize.value);
};

// Método para limpiar el diagrama
const clearDiagram = () => {
    diagramManager.clearDiagram();
};

</script>
