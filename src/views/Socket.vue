<template>
    <div class="p-4">
        <h2>Prueba de WebSocket</h2>
        <p class="font-bold">Crear sala para proyecto</p>

        <h2>Unirse a sala</h2>
        <input v-model="codigo" placeholder="Código de sala" />
        <button @click="unirse">Unirse</button>
        <p>{{ mensaje }}</p>

        <button @click="crearSala" class="bg-blue-500 text-white px-4 py-2 rounded">
            Crear sala
        </button>
        <p v-if="mensajeError">{{ mensajeError }}</p>

        <div v-if="codigoSala" class="mt-4">
            <p>Código de sala: <strong>{{ codigoSala }}</strong></p>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useSalaStore } from '@/stores/salas'
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();


const sala = useSalaStore();
const mensajeError = ref("")

const codigoSala = ref(null)

const crearSala = async () => {
    try {
        const data = await sala.createSala({ proyectoId: 4, usuarioId: auth.user.id })
        // console.log(data)
        codigoSala.value = data.sala.codigo
    } catch (err) {
        if (err.response && err.response.data) {
            console.error("❌ Error del backend:", err.response.data)
            const msg = err.response.data?.errors?.[0]?.msg || "Error desconocido"
            mensajeError.value = msg
        } else {
            console.error("❌ Error inesperado:", err)
        }
    }
}


const unirse = async () => {
    try {
        const data = await sala.joinSala({
            usuarioId: auth.user.id,
            codigo: codigo.value,
        });
        mensaje.value = `✅ Te uniste a la sala con ID: ${data.salaId}`;
    } catch (err) {
        if (err.response?.data?.errors?.length) {
            mensaje.value = `❌ ${err.response.data.errors[0].msg}`;
        } else {
            mensaje.value = '❌ Error inesperado';
        }
    }
}




</script>