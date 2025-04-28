<script setup> 
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const usuario = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleRegister = async () => {
    error.value = ''
    try {
        console.log('registrar');
        
        await auth.register({ usuario: usuario.value, email: email.value, password: password.value })
        router.push('/dashboard')
    } catch (e) {
        error.value = e.response.data.errors[0].msg
    }
}


</script>


<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="min-width: 320px; max-width: 400px; width: 100%;">
            <h2 class="mb-4 text-center">
                <img src="/public/machine-vision-svgrepo-com.svg" width="100" height="90" alt="Logo" />
            </h2>
            <h2 class="mb-4 text-center">Registrarse</h2>
            <form @submit.prevent="handleRegister">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuario</label>
                    <input type="usuario" class="form-control" id="usuario" v-model="usuario" required />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="email" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="password" v-model="password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Registrarse</button>
                <p v-if="error" style="color: red">{{ error }}</p>

                <div class="form-check d-flex justify-content m-5">
                    
                    <label class="form-check-label" for="form2Example3">
                      ya tengo cuenta <a href="/login">aqui</a>
                    </label>
                  </div>
            </form>
        </div>
    </div>
</template>