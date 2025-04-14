<!-- src/views/Login.vue -->
<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="username" placeholder="Usuario" />
            <input v-model="password" type="password" placeholder="Contraseña" />
            <button type="submit">Entrar</button>
            <p v-if="error" style="color: red">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
    error.value = ''
    try {
        await auth.login({ email: username.value, password: password.value })
        router.push('/dashboard')
    } catch (e) {
        error.value = e.message
    }
}
</script>