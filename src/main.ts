import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import '@mdi/font/css/materialdesignicons.css'
import 'primeicons/primeicons.css'
import './styles/main.css'
import App from './App.vue'
import router from './router'

// PrimeVue components used globally across templates
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import DatePicker from 'primevue/datepicker'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(ToastService)

// Register PrimeVue components globally
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('Password', Password)
app.component('DatePicker', DatePicker)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Tag', Tag)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)

app.mount('#app')