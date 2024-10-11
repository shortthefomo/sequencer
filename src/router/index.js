import { createRouter, createWebHistory } from 'vue-router'
import Dash from '../views/Dash.vue'

export const routes = [
    {
        path: '/',
        name: 'Dash',
        component: Dash,
        meta: { layout: 'MainLayout' }
    },
]

const history = createWebHistory()

const router = createRouter({
    history,
    routes,
})

export default router