import { createApp } from 'vue'

import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import { createStore } from 'vuex'
import { AppStore } from './store/AppStore.js'
import VueNumerals from 'vue-numerals'

const store = createStore({
    modules: {
        AppStore,
    }
})

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueNumerals)
app.use(VueAxios, axios)
app.mount('#app')
