import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Form, Field, Button, Toast, Tag, Progress, Card, NavBar, List, Cell, Popup } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Form)
app.use(Field)
app.use(Button)
app.use(Tag)
app.use(Progress)
app.use(Card)
app.use(NavBar)
app.use(List)
app.use(Cell)
app.use(Popup)
app.mount('#app')

app.config.globalProperties.$toast = Toast
