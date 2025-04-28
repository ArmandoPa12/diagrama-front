<template>
  <div>

      <div class="row p-3">
        <div class="col">
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="nombreProyecto" placeholder="Nuevo proyecto" aria-label="Recipient's username"
              aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button class="btn btn-outline-primary" @click="crearProyecto" type="button">Crear</button>
            </div>
          </div>
        </div>
        <div class="col"></div>
        <div class="col">
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="codigoColaboracion" placeholder="codigo proyecto" aria-label="Recipient's username"
              aria-describedby="basic-addon2">  
            <div class="input-group-append">
              <button class="btn btn-outline-success"  @click="unirseProyecto" type="button">Unirse</button>
            </div>
          </div>
        </div>
      </div>


    <p v-if="mensajeError">{{ mensajeError }}</p>

    <div class="album py-5 bg-body-tertiary">
      <div class="container">

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div :key="item.id" v-for="item in proyecto.proyectos" class="col">
            <div class="card shadow-sm">
              <img v-if="item.imagenUrl" :src="`${backendUrl}${item.imagenUrl}`" class="card-img-top"
                alt="Imagen del diagrama" style="height: 225px; object-fit: contain; object-position: center" />
              <div v-else style="
                    height: 225px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f0f0f0;
                    color: #888;
                    font-size: 1rem;
                    font-weight: 500;
                    border-bottom: 1px solid #ddd;
                  ">
                No hay imagen
              </div>
              <div class="card-body">
                <strong class="card-text">{{ item.nombre }}</strong>
                <!-- <p class="card-text">Creado el: {{ formatFecha(item.updatedAt) }}</p> -->
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button"  v-if="item.sala" @click="entrarDiagrama(item.sala.codigo, item.id)" class="btn btn-sm btn-outline-secondary">Entrar</button>
                    <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button> -->
                  </div>
                  <small class="text-body-secondary">{{ formatFecha(item.updatedAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProyectosStore } from '@/stores/proyectos';
import { Router } from 'gojs';
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useSalaStore } from '@/stores/salas'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')


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
    // router.push({
    //   name: 'diagrama',
    //   params: {
    //     id: resultado.id,
    //     codigo: codigoSala.value
    //   }
    // })
    router.push({
      name: 'diagrama',
      params: {
        id: resultado.id,
        codigo: codigoSala.value
      }
    });

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

const entrarDiagrama = (codigo, id) => {
  router.push({
    name: 'diagrama',
    params: { id: id, codigo: codigo }
  });
};

const formatFecha = (fecha) => {
  // return moment(fecha).startOf('hour').fromNow();
  return moment(fecha).format('LT');
}

const unirseProyecto = async () => {
  try {
    const res = await sala.colaboradorSala({
      "usuarioId": auth.user.id,
      "codigo": codigoColaboracion.value
    });

    router.push({
      name: 'colaborativo',
      params: {
        codigo: codigoColaboracion.value
      }
    });
  } catch (error) {
    mensajeError.value = error.response.data.message;
    console.log(error.response.data.message);
  }
}


</script>