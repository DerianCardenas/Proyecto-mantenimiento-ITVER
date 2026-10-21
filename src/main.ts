import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import './styles/main.css'
import './styles/dialogs.css'
import './styles/technicians.css'
import App from './App.vue'
import router from './router'
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
const app=createApp(App)
app.use(createPinia());app.use(router);app.use(PrimeVue,{theme:{preset:Aura},locale:{
  firstDayOfWeek:1,
  dayNames:['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
  dayNamesShort:['dom','lun','mar','mié','jue','vie','sáb'],
  dayNamesMin:['D','L','M','X','J','V','S'],
  monthNames:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  monthNamesShort:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
  today:'Hoy',clear:'Limpiar',weekHeader:'Sem'
}});app.use(ToastService)
app.component('Button',Button);app.component('InputText',InputText);app.component('Textarea',Textarea);app.component('Dropdown',Dropdown);app.component('Password',Password);app.component('DatePicker',DatePicker);app.component('ProgressSpinner',ProgressSpinner);app.component('Tag',Tag);app.component('Toast',Toast);app.component('ConfirmDialog',ConfirmDialog)
app.mount('#app')
