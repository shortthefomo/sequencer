import { createApp } from 'vue'

import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueNumerals from 'vue-numerals'


const app = createApp(App)

app.use(router)
app.use(VueNumerals)
app.use(VueAxios, axios)
app.mount('#app')
