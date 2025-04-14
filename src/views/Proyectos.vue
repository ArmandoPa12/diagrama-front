<template>
  <div>
    aqui estan los proyectos
    <div>Total proyectos: {{ proyecto.totalProyectos }}</div>

    <div v-if="codigoSala" class="mt-4">
      <p>Código de sala: <strong>{{ codigoSala }}</strong></p>
    </div>

    <input type="text" v-model="nombreProyecto" id="nombre">
    <button @click="crearProyecto">Crear Proyecto</button>

    <input type="text" v-model="codigoColaboracion" id="codigo">
    <button @click="unirseProyecto">Unirse a otro proyecto</button>
    
    <p v-if="mensajeError">{{ mensajeError }}</p>

    <li :key="item.id" v-for="item in proyecto.proyectos">
      {{ item.id }}
      {{ item.nombre }}
      {{ item.createdAt }} -
      {{ item.sala ? item.sala.codigo : 'No existe código' }}
      <button v-if="item.sala" @click="entrarDiagrama(item.sala.codigo,item.id)">Entrar</button>
      <br>
    </li>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProyectosStore } from '@/stores/proyectos';
import { Router } from 'gojs';
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useSalaStore } from '@/stores/salas'


const proyecto = useProyectosStore();
const sala = useSalaStore();
const router = useRouter();
const auth = useAuthStore();
const nombreProyecto = ref('');
const proyectos = ref([]);
const mensajeError = ref("")
const codigoSala = ref(null)
const codigoColaboracion = ref("");

onMounted(() => {
  proyecto.getProyectos({ userId: auth.user.id });
});



const crearProyecto = async () => {

  if (!nombreProyecto.value.trim()) {
    mensajeError.value = 'El nombre del proyecto es obligatorio.'
    return
  }

  try {
    // Crear el proyecto
    const resultado = await proyecto.createProyecto({
      nombre: nombreProyecto.value,
      userId: auth.user.id,
      diagrama: ''
    })

    console.log('Proyecto creado:', resultado)

    // Crear la sala
    const data = await sala.createSala({
      proyectoId: resultado.id,
      usuarioId: auth.user.id
    })

    codigoSala.value = data.sala.codigo

    // Redirigir a la ruta con el código de la sala
    router.push({
      name: 'diagrama',
      params: {
        id: resultado.id,
        codigo: codigoSala.value
      }
    })

    // Limpiar input
    nombreProyecto.value = ''

  } catch (err) {
    // Manejar errores de creación de proyecto o sala
    const msg =
      err.response?.data?.errors?.[0]?.msg ||
      err.response?.data?.message || 
      "Error desco  nocido"
    mensajeError.value = msg
    console.error("Error:", err)
  }
}

const entrarDiagrama = (codigo,id) => {
  router.push({
    name: 'diagrama',
    params: { id:id ,codigo: codigo }
  });
};

const unirseProyecto = async() =>{
  try {
    const res = await sala.colaboradorSala({
    "usuarioId":auth.user.id,
    "codigo":codigoColaboracion.value
    });

    router.push({
      name: 'colaborativo',
      params: {
        codigo: codigoColaboracion.value
      }
    })
  } catch (error) {
    mensajeError.value = error.response.data.message;
    console.log(error.response.data.message);
  }
}


</script>