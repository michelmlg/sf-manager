import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';

import './assets/theme.css';
import './assets/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(createHead());
app.use(router);
app.mount('#app');