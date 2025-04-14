// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSalaStore = defineStore('sala', () => {

    // const proyectos = ref([])

    const createSala = async(datos) => {
        try {
            const res = await axios.post('api/sala', datos)
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    const joinSala = async(datos) => {
        console.log(datos);
        try {
            const res = await axios.post('api/sala/unirse', datos);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    const miembrosSala = async(datos) => {
        try {
            const res = await axios.post('api/sala/colaboradores', datos);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    const colaboradorSala = async(datos) => {
        try {
            const res = await axios.post('api/sala/sala-unirse', datos);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    return { createSala, joinSala, miembrosSala, colaboradorSala }
})