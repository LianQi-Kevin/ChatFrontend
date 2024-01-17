import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
// to support element dark style
import 'element-plus/theme-chalk/dark/css-vars.css'
// router
import router from '@/router/index.js'

// 创建vue实例
const app = createApp(App);

// 启用vue-router
app.use(router)

// 绑定APP.vue到DOM
app.mount('#app');
