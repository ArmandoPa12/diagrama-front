  <template>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="imagen" class="form-label">Seleccionar imagen</label>
        <input type="file" id="imagen" class="form-control" accept="image/*" @change="handleFileChange" />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Cerrar Proyecto' }}
      </button>

      <button @click="generarImagenDelDiagrama" class="btn btn-secondary mt-3">
        Generar imagen del diagrama
      </button>

      <div v-if="imagenGenerada" class="mt-3">
        <p>Vista previa de la imagen generada:</p>
        <img :src="imagenGenerada" alt="Diagrama generado" class="img-fluid border" />
      </div>

      <p v-if="mensaje" class="mt-2 text-success">{{ mensaje }}</p>
      <p v-if="error" class="mt-2 text-danger">{{ error }}</p>
    </form>

    

    <div>
      <div ref="diagramContainer" style="width: 100%; height: 500px; border: 1px solid black"></div>
    </div>
  </template>


<script setup>

import { onMounted, onBeforeUnmount, ref } from "vue";
import * as go from "gojs";

import { useProyectosStore } from '@/stores/proyectos'

const store = useProyectosStore()
const imagen = ref(null)
const loading = ref(false)
const mensaje = ref('')
const error = ref('')
const imagenGenerada = ref(null)


function handleFileChange(event) {
  imagen.value = event.target.files[0]
}


async function handleSubmit() {
  if (!imagen.value) {
    error.value = 'Debe seleccionar una imagen.'
    return
  }

  const formData = new FormData()
  formData.append('imagenData', imagen.value)

  loading.value = true
  mensaje.value = ''
  error.value = ''

  try {
    await store.cerrarProyecto(formData, 1)
    mensaje.value = 'Imagen enviada correctamente.'
  } catch (err) {
    error.value = 'Ocurrió un error al enviar la imagen.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const diagramContainer = ref(null);
let diagram = null;

async function generarImagenDelDiagrama() {
  if (!diagram) return;

  const imageDataUrl = diagram.makeImageData({
    background: "white",
    scale: 1,
    type: "image/png",
    imageFormat: "png"
  });

  // Convertir la dataURL a archivo
  const imagenFile = dataURLToFile(imageDataUrl, 'diagrama.png');

  const formData = new FormData();
  formData.append('imagenData', imagenFile);

  try {
    await store.cerrarProyecto(formData, 2);
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

