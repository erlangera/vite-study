import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// 导入该文件会产生解析错误
// import './assets/base-error.css'

createApp(App).mount('#app')
