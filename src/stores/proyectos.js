// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProyectosStore = defineStore('proyecto', () => {

    const proyectos = ref([])

    const getProyectos = async(userId) => {

        try {
            const res = await axios.post('api/proyecto/lista', userId)
            proyectos.value = res.data;

        } catch (error) {
            throw error;
        }
    }

    const getProyectoUno = async(datos) => {

        try {
            const res = await axios.post('api/proyecto/uno', datos)
            return res.data;

        } catch (error) {
            throw error;
        }
    }

    const createProyecto = async(datos) => {
        try {
            const res = await axios.post('api/proyecto', datos)
            return res.data;
        } catch (error) {
            throw error;
        }
    }


    const updateProyecto = async(datos, id) => {
        try {
            // console.log(datos, id);
            // console.log(`api/proyecto/${id}`);
            const res = await axios.post(`api/proyecto/${id}`, datos);
            return res.data;
        } catch (error) {
            throw error;
        }
    };



    const totalProyectos = computed(() => proyectos.value.length)

    return { getProyectos, proyectos, totalProyectos, createProyecto, getProyectoUno, updateProyecto }
})