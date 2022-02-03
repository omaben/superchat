import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import i18n from "./i18n";
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import tools from '@/services/tool'
//import VueRecord from '@codekraft-studio/vue-record'
import AudioRecorder from 'vue-audio-recorder'
import vueInternetChecker from 'vue-internet-checker';

import draggable from 'vuedraggable'
//---滑块验证
import "./assets/js/verify";

import '@/icons' // icon
import '@/icons/svg.js'
import '@/permission' // permission control
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
let lang = sessionStorage.getItem('local') || 'zh'
if (lang === 'en') {
    Vue.use(ElementUI, { locale })
} else {
    Vue.use(ElementUI)
}
Vue.use(tools)
    //Vue.use(VueRecord)
Vue.use(AudioRecorder)
Vue.use(vueInternetChecker)
Vue.config.productionTip = false
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import VEmojiPicker from "v-emoji-picker"
Vue.use(VEmojiPicker);
import Toasted from 'vue-toasted';
Vue.use(Toasted);
import VueAudio from 'vue-audio-better'
Vue.use(VueAudio)
import VueCountryCode from "vue-country-code";
Vue.use(VueCountryCode)
import Lingallery from 'Lingallery'
Vue.use(Lingallery)
import VueSlickCarousel from 'vue-slick-carousel'
Vue.use(VueSlickCarousel)

import DonMessage from '@/components/message'
Vue.prototype.$message = new DonMessage()
import VueScrollTo from 'vue-scrollto'
Vue.use(VueScrollTo)
Vue.use(draggable)
import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);
import VueVideoPlayer from 'vue-video-player'
Vue.use(VueVideoPlayer);
import 'video.js/dist/video-js.css'

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})