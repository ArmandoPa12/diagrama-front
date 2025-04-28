import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'


import App from './App.vue'
import router from './router'
// const path = require('path');


const app = createApp(App)

app.use(createPinia())
app.use(router)
    // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.mount('#app')