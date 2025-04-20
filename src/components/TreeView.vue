<!-- <template>
  <div>
    <vue-draggable-tree
      :data="arbolData"
      :indent="20"
      :draggable="true"
      :droppable="true"
      @change="handleChange"
      node-key="key"
    >
      <template #default="{ node }">
        <div>{{ node.text }}</div>
      </template>
    </vue-draggable-tree>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueDraggableTree from 'vue-draggable-tree';
import 'vue-drag-tree/dist/vue-drag-tree.min.css'

defineProps({
  arbolJerarquico: Object // reactive ref que contiene .value
});

const emit = defineEmits(['update']);

const arbolData = ref([]);

watch(
  () => arbolJerarquico.value,
  (nuevoValor) => {
    if (nuevoValor) {
      arbolData.value = [nuevoValor]; // Lo transformamos a arreglo porque vue-draggable-tree necesita una lista de nodos raíz
    }
  },
  { immediate: true, deep: true }
);

function handleChange(nuevoArbol) {
  if (nuevoArbol.length > 0) {
    arbolJerarquico.value = nuevoArbol[0]; // Volvemos a ponerlo como un solo objeto
    emit('update', arbolJerarquico.value);
  }
}
</script> -->
