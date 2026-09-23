import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/aura/all.css'
import 'primeicons/primeicons.css'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { theme: { preset: Aura } })
app.mount('#app')
