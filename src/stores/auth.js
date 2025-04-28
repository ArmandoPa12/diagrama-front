// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const userId = ref(null)
    const token = ref(null)


    const login = async(credenciales) => {
        try {
            const res = await axios.post('api/users/login', credenciales)

            console.log(res);
            user.value = res.data.user;
            // userId.value = res.data.
            token.value = res.data.token;

            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.setItem('token', res.data.token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

        } catch (error) {
            throw error;
        }
    }

    const register = async(datos) => {
        try {
            const res = await axios.post('api/users/register', datos)

            // console.log(res.data);
            user.value = res.data.user;
            // // userId.value = res.data.
            token.value = res.data.token;

            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.setItem('token', res.data.token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

        } catch (error) {
            throw error;
        }
    }


    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
    }

    const isAuthenticated = () => !!user.value && !!token.value

    // Cargar desde localStorage al iniciar
    const init = () => {
        const userData = localStorage.getItem('user')
        const savedToken = localStorage.getItem('token')

        if (userData && savedToken) {
            user.value = JSON.parse(userData)
            token.value = savedToken
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        }
    }

    return { user, token, login, logout, isAuthenticated, init, register }
})