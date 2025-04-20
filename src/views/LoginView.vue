<!-- src/views/Login.vue -->
<template>

    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="min-width: 320px; max-width: 400px; width: 100%;">
            <h2 class="mb-4 text-center">
                <img src="/public/machine-vision-svgrepo-com.svg" width="100" height="90" alt="Logo" />
            </h2>
            <h2 class="mb-4 text-center">Iniciar sesión</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="username" class="form-label">Correo electrónico</label>
                    <input type="username" class="form-control" id="username" v-model="username" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="password" v-model="password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Entrar</button>
                <p v-if="error" style="color: red">{{ error }}</p>
            </form>
        </div>
    </div>
    <!-- <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="username" placeholder="Usuario" />
            <input v-model="password" type="password" placeholder="Contraseña" />
            <button type="submit">Entrar</button>
            <p v-if="error" style="color: red">{{ error }}</p>
        </form>
    </div> -->
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
        error.value = e.response.data.error
        
    }
}
</script>