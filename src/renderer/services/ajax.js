'use strict'

import axios from 'axios';
import Vue from 'vue';
import router from '../router';
import store from '../store/index';
import { decrypt, encrypt } from '@/services/tool';
const configs = require('../configs.js');
let localStr = sessionStorage.getItem("local") || "zh";

const vue = new Vue({
    router,
    store
});
const headers = (token) => {
    return {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=utf-8;",
        sid: token,
        platform: "PC",
        lang: localStr, // 同 wap
    };

}


axios.interceptors.request.use(config => {
    config.baseURL = configs.baseURL;
    config.timeout = 60 * 1000; // Timeout
    return config
}, error => {
    return Promise.reject(error)
});


axios.interceptors.response.use(res => {

    let data, deData;
    if (res && res.data && res.data.data) {
        data = res.data.data;
        // console.log("in_data: ",data)
        deData = decrypt(data);
        if (!deData) {
            return res;
        }
        if (deData.success) {} else {
            if (deData.code == 1008) {
                sessionStorage.removeItem("token");
                if (vue.$route.path != '/loginPhone') {
                    vue.$router.push("/loginPhone");
                }
            }
        }
    }



    return res;

}, error => {
    //console.log(error, "eeeeev", error.response);
    if (error.response) {
        let { status, statusText } = error.response;
        if (status === 500) {
            vue.$message.error(statusText);
            return
        }
    }

    return Promise.resolve(error.response)
});




const post = (url, data, isUploadFile = false) => {
    // let TOKEN = localStorage.getItem("token") || '';
    let TOKEN = vue.$store.getters.token || "";
    let datas = data ? data : {};
    datas = encrypt(datas);
    // console.log("datas: ",datas)
    // if(isCrypto==1){
    //     datas = encrypt(data)   // 加密
    // }else if(isCrypto==2){
    //     datas = decrypt(data)   // 解密
    // }else{
    //     datas = data; //不处理
    // }
    return axios({
        method: "post",
        url,
        headers: headers(TOKEN),
        // data: isUploadFile ? datas : JSON.stringify(datas),
        data: datas,
    }).then((response) => {
        let res = {...response };
        if (res) {
            if (res.data && res.data.data) {
                res.data.data = decrypt(res.data.data);
            }
            return res.data;
        }
    });
}



//创建实例
var newService = axios.create();

//上传文件
const form = (url, data) => {
    let TOKEN = vue.$store.getters.token || "";
    return axios({
        method: "post",
        url,
        headers: headers(TOKEN),
        data: data,
    }).then((response) => {
        let res = {...response };
        if (res) {
            if (res.data && res.data.data) {
                res.data.data = decrypt(res.data.data);
            }
            return res.data;
        }
    });

}



newService.interceptors.request.use(
    (config) => {
        config.baseURL = configs.baseURL;
        config.timeout = 60 * 1000; // Timeout
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
const get = (url) => {
    let TOKEN = vue.$store.state.token || '';
    return newService({
        method: "get",
        url,
        headers: headers(TOKEN),
    }).then((response) => {
        return response;
    });
}



export default {
    post,
    form,
    get
}