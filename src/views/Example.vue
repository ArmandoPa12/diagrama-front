<template>
    <div>
        <div ref="diagramContainer" style="width: 100%; height: 500px; border: 1px solid black"></div>
    </div>
</template>


<script setup>

import { onMounted, onBeforeUnmount, ref } from "vue";
import * as go from "gojs";

const diagramContainer = ref(null);
let diagram = null;

onMounted(() => {
  const $ = go.GraphObject.make;

  diagram = $(go.Diagram, diagramContainer.value, {
    "undoManager.isEnabled": true,
  });

  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    $(go.Shape, "RoundedRectangle", { fill: "lightblue" }),
    $(go.TextBlock, { margin: 8 }, new go.Binding("text", "key"))
  );

  diagram.model = new go.GraphLinksModel(
    [{ key: "Nodo 1" }, { key: "Nodo 2" }],
    [{ from: "Nodo 1", to: "Nodo 2" }]
  );
});

onBeforeUnmount(() => {
  if (diagram) {
    diagram.div = null;
  }
});
</script>

