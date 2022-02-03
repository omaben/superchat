/*
 * @Author: your name
 * @Date: 2019-11-26 09:46:33
 * @LastEditTime: 2019-12-16 16:31:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /wapsite/pk-skin/2/src/i18n/index.js
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';

let localStr = sessionStorage.getItem('local');


Vue.use(VueI18n);

import zh from './config/zh';
import en from './config/en';
import tc from './config/tc';

const i18n = new VueI18n({
    locale: localStr || 'zh',
    silentTranslationWarn: true,
    messages: {
        zh,
        en,
        tc
    }
})

export default i18n;