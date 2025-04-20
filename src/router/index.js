import { createRouter, createWebHistory } from 'vue-router'
import Example from '@/views/Example.vue'
import Grid from '@/views/Grid.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import Dashboard from '@/views/Dashboard.vue'
import Socket from '@/views/socket.vue'
import Diagrama from '@/views/Diagrama.vue'
import Colaboracion from '@/views/Colaboracion.vue'
import ConversionView from '@/views/ConversionView.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [

                {
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () =>
                        import ('../views/AboutView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/socket',
                    name: 'socket',
                    component: Socket,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/home-convert',
                    name: 'home-convert',
                    component: ConversionView,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/example',
                    name: 'example',
                    component: Example,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/grid',
                    name: 'grid',
                    component: Grid,
                    meta: { requiresAuth: true }
                },
            ]
        },
        {
            path: '/diagrama/:id/:codigo',
            component: Diagrama,
            name: 'diagrama',
            meta: { requiresAuth: true }
        },
        {
            path: '/colaborativo/:codigo',
            component: Diagrama,
            name: 'colaborativo',
            meta: { requiresAuth: true }
        },

    ],
})


router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    auth.init()

    if (to.meta.requiresAuth && !auth.isAuthenticated()) {
        next('/login')
    } else {
        next()
    }
})

export default router