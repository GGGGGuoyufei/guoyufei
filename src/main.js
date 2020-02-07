import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import "./utils/rem"
import echarts from "echarts"
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import Router from 'vue-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import axios from 'axios'
import iconPicker from 'vue-fontawesome-elementui-icon-picker'
//vue.js插件
import MyPlugin from "@/utils/myPlugin"
Vue.prototype.$ajax = axios
Vue.use(ViewUI);
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(MyPlugin);
Vue.use(iconPicker)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$globalEventBus  =  new  Vue()
    //解决双击路由出现的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//i18n配置
// const i18n = new VueI18n({
//   locale: localStorage.getItem("lang") ||'cn', // 语言标识
// messages,
// })
// locale.i18n((key, value) => i18n.t(key, value))

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')