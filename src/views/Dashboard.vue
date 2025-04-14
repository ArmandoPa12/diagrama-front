<!-- src/views/Dashboard.vue -->
<template>
    <div>
        
      <h2>Bienvenido, {{ auth.user?.usuario }}</h2>
      <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/example">example</RouterLink>
        <RouterLink to="/socket">example</RouterLink>
        <RouterLink to="/grid">Cuadrado</RouterLink>
        <br>
        <RouterLink to="/diagrama">Diagrama</RouterLink>
      </nav>


      <RouterView />

      <Proyectos/>


    </div>
      <button @click="logout">Cerrar sesión</button>
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
  