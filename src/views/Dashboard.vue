<!-- src/views/Dashboard.vue -->
<template>
  <div>
    <nav>
      <div class="">
        <header
          class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div class="col-md-3 mb-2 mb-md-0 d-flex flex-wrap align-items-center">
            <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
              <img src="/public/machine-vision-svgrepo-com.svg" width="70" height="50" alt="Logo" />
            </a>
            <small>{{ auth.user?.usuario }}</small>
          </div>

          <!-- <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li>
              <RouterLink to="/" class="nav-link px-2">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="/home-convert" class="nav-link px-2">Convert</RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="nav-link px-2">About</RouterLink>
            </li>
            <li>
              <RouterLink to="/example" class="nav-link px-2">Example</RouterLink>
            </li>
            <li>
              <RouterLink to="/socket" class="nav-link px-2">Socket</RouterLink>
            </li>
            <li>
              <RouterLink to="/grid" class="nav-link px-2">Grid</RouterLink>
            </li>
            <li>
              <RouterLink to="/diagrama" class="nav-link px-2">Diagrama</RouterLink>
            </li>
          </ul> -->

          <div class="col-md-3 text-end">
            <button type="button" @click="logout" class="btn btn-outline-primary me-2">Log-out</button>
          </div>         
        </header>
      </div>
    </nav>
    <RouterView />

    <Proyectos v-if="router.currentRoute._value.path === '/dashboard'" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Proyectos from './Proyectos.vue'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>