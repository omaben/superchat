<template>
<div class="login-container">
    <vue-country-code @onSelect="onSelectCountry" style="display:none"></vue-country-code>
    <el-dropdown class="lang-update" trigger="click" @command="changeLang">
        <span class="el-dropdown-link">
            <img  :src="require('@/assets/svg/language.svg')" alt="">

            {{$t('select_language')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in rootConfig.langArr" :command="item.value" :key="item.value" :class="{'active':lang === item.value}">{{item.key}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="title">
            <img  :src="require('@/assets/svg/logo.png')" alt="">
            <!-- <h3>
                {{$t('welcomeToChaoxin')}}
            </h3> -->

        </div>
        
        <el-form-item prop="phone" v-if="appConfig && appConfig.loginRegMethod === 1 || !appConfig">
            <el-input name="phone" type="text" 
                v-model="loginForm.phone" @keyup.native="changeTel" @focus="changeTelfocus"
                autoComplete="on" :placeholder="mobileNumbCode.phoneFormat"  :maxlength="mobileNumbCode.lenght" >
                <template slot="prepend">
                    <IntlTelInput @excountry="getMobileNumbCode" @excountry1='getMobileNumbCode1'  class="mobileSelect"></IntlTelInput>
                </template>
            </el-input>
            <img class="show-pwd" v-show="loginForm.phone" @click="loginForm.phone = ''" src="@/assets/icon_del.png" alt="">
        </el-form-item>
        <div class="logclass">
            <p @click="logType(1)" v-if="appConfig && appConfig.loginRegMethod === 1" :class="{'act':logStatus==1}">{{$t('passwordLogin')}}</p>
            <p @click="logType(2)" v-if="appConfig && appConfig.loginRegMethod === 1" :class="{'act':logStatus==2}">{{$t('smsLogin')}}</p>
        </div>
        <el-form-item prop="phone" v-if="appConfig && appConfig.loginRegMethod === 2">
            <el-input name="account" type="text" v-model="loginForm.account" :placeholder="$t('account')" >
            </el-input>
            <img class="show-pwd" v-show="loginForm.phone" @click="loginForm.phone = ''" src="@/assets/icon_del.png" alt="">
        </el-form-item>
        
        <template v-if="logStatus!=2">
            <div>
                <el-form-item prop="password">
                    <el-input name="password" :type="pwdType" @keyup.enter.native="toLogin" v-model="loginForm.password" autoComplete="on" :placeholder="$t('password')"></el-input>
                    <img class="show-pwd" v-show="!pwdType" @click="showPwd" src="@/assets/icon_eye_xs.png" alt="">
                    <img class="show-pwd" v-show="pwdType" @click="showPwd" src="@/assets/icon_eye_yc.png" alt="">

                </el-form-item>
                <div class="pwd-style" v-if="logStatus==1">
                    <div class="remember-pwd">
                        <el-checkbox v-model="remember"  @change='rememberPwd'>{{$t('rememberPassword')}}</el-checkbox>
                    </div>
                    <div class="forget-pwd" @click="toPath('forgetPWD')">
                        <span>{{$t('forgetPassword')}}？</span>
                    </div>
                </div>
            </div>
        </template>
        <div v-if="logStatus==2">
            <el-form-item prop="checkCode">
                <el-input name="checkCode" type="text" :placeholder="$t('p_VerCode')" v-model="loginForm.checkCode" autoComplete="on"></el-input>
                <div class="getCaptcha" :class="{'getCaptchablue':loginForm.phone}" @click="doShortMsg">
                    {{phoneCodeText}}
                </div>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="toLogin">
                {{$t('logIn')}}
            </el-button>
        </el-form-item>
        <p class="to-registered">{{$t('noAccountYet')}} <span @click="toPath('registerPhone')">{{$t('signUpNow')}}</span></p>
    </el-form>
    <!-- 验证码 start -->
    <Mpanels :type="1" v-if="mpanelShow" @success="onMpanelSuccess" :account="account" @close="close"></Mpanels>
    <div class="user-agreement-link">
            <p>{{$t('signUpToAgree')}}</p>
            <p @click="userAgreement=true" class="link-agreement">{{$t('userAgreement')}}</p>
        </div>
    <el-dialog
            :title="$t('userAgreement')"
            :visible.sync="userAgreement"
            width="80%"
            class="use-arg"
        >
            <div v-html="$t('userAgreementText')" class="user-agreement"></div>
            
        </el-dialog>
</div>
</template>

<script>
import {loginStore} from 'tool/storage.js'
import IntlTelInput from "@/components/IntlTelInput/IntlTelInput1";
import Mpanels from "@/components/Mpanels.vue"; //验证
import { phoneCode,phoneCodeVer,getElseMai} from "@/services/index"
import fData from '@/app.config';
import IM from "@/services/im/connect";
import { chatInRoomsDAO, NoticeMsgDAO } from "@/services/db";
import countries from '@/components/IntlTelInput/countryList'
import {machineId, machineIdSync} from 'node-machine-id';
import CryptoJS from 'crypto-js'
import DeviceDetector from "device-detector-js";

export default {
    name: 'loginPhone',
    components: {
        IntlTelInput,
        Mpanels
    },
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('mustY')));
            } else if (!fData.pwdReg.test(value)) {
                callback(new Error(this.$t('pwd_str')));
            } else {
                callback();
            }
        };
        let password = [
            { validator: validatePass, trigger: 'blur' }
        ]
        
        return {
            currentCode: {},
            countries: countries,
            areaCode:'',
            account: sessionStorage.getItem('account'),
            appConfig:'',
            mpanelShow: false,
            userAgreement: false,
            loginForm: {
                account: sessionStorage.getItem('account'),
                // password: ''
                // account: '+9710527123123',
                // password: 'q22222',

                areaCode: '',
                phone: sessionStorage.getItem('AccountRemeber'),
                password: '',
                checkCode: ''
            },
            mobileNumbCode: {},
            loginRules: {
                /* phone: fData.MUST, */
            },
            loading: false,
            pwdType: 'password',
            remember: sessionStorage.getItem('remember')==='true' ? true : false,
            phoneCodeText: this.$t('get_VerCode'),
            getPhoneCode: false,
            logStatus: 1,
            lang: sessionStorage.getItem('local') || 'zh',
        }
    },
    created(){
        // let str = "A/0SaDSqANDSDtr/Dzc+r3/FKp0LMFZ4TSGA590ffYlazMG/qQqtT8d9Pe1U9JhBeEWyspW6y7Glt+yA8CPb+MVNBdTzZjos4FjRrQbKU6qsYJU6I5KiufL5HhVACiy9hHULROJOdkbnJx79mE8FMw=="
        // let msg = this.decrypt(str)
        // console.log("msg: ",msg)
        
         //console.log("userstore: ", this.userStore.store);
        
        // this.userStore.delete("RC_298")
        //console.log("userstore: ", this.userStore.store);

    },
    mounted() {
        this.appConfig = JSON.parse(sessionStorage.getItem("appConfig"))
        this.$bus.$off('updateAppConfig')
        this.$bus.$on('updateAppConfig', () => {
            this.appConfig = JSON.parse(sessionStorage.getItem("appConfig"))
            
        })
    },
    methods: {
        changeLang(data) {
            sessionStorage.setItem('local', data)
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || ''
            this.ipcRenderer.send("changeLang", data, userInfo);
        },
        
        changeTelfocus() {
            if(this.loginForm.phone!=null){
                this.loginForm.phone = (/[^0-9]/g.test(this.loginForm.phone)) ? '' : this.loginForm.phone;
            }
        },
        changeTel() {
            if(this.loginForm.phone!=null){
                this.loginForm.phone = this.loginForm.phone.replace(/[^0-9]/g, '');
                //if(this.remember){
                    let key = this.loginForm.areaCode + this.loginForm.phone
                    let value = sessionStorage.getItem(key) || '';
                    if(!value){
                        this.$set(this.loginForm,'password', '')
                        return
                    }
                    this.$set(this.loginForm,'password', this.decrypt(value))
                //}
            }
        },
        close(){
            console.log('关闭了')
            this.mpanelShow=false;
        },
        //获取短信验证码
        doShortMsg(){
            if(this.phoneCodeText === this.$t('get_VerCode')){
                 let post = {
                    phone: "+" + this.mobileNumbCode.dialCode + this.loginForm.phone,
                    isLogin: 1,
                }
                
                phoneCode(post).then(res=>{
                        this.countDown();
                    //  if(res.data.success){
                        if(res.data){
                            if(JSON.parse(res.data).code == 200){
                                    let url = `/GetPhoneCode?+971${this.loginForm.phone}`
                                    /* getElseMail(url).then(res => {
                                        let data = res.data; 
                                        let dedata = this.decrypt(data)
                                        console.log("dedata: ",dedata)
                                    }) */
                                    /* getElseMail(url).then(res => {
                                        console.log("code: ", res.data);
                                    }) */
                                this.getSecond(60); 

                                }else{
                                    this.$message.error(res.message)
                                }
                        }else if(res.code == 5001){
                            this.$message.error(res.message)
                            this.getSecond(0);
                        }
                    

                })

                

            }
           
        },
        countDown() {
            // localStorage.removeItem(this.registerForm.mobileNumb);
            // this.nowtime = Date.parse(new Date()) / 1000;
            // localStorage.setItem(this.registerForm.mobileNumb, this.nowtime + 59);
            this.getSecond(60);
        },
        //发送验证码
        getSecond(wait) {
            let _this = this;
            let _wait = wait;
            if (wait == 0) {
                this.getPhoneCode = false;
                this.phoneCodeText = this.$t('get_VerCode')
                wait = _wait;
            } else {
                this.getPhoneCode = true;
                this.phoneCodeText = wait + "s"
                wait--;
                setTimeout(() => {
                    _this.getSecond(wait);
                }, 1000);
            }
        },
        onSelectCountry({name, iso2, dialCode}) {
            let currentCode=this.countries.filter((item)=>item.dialCode==dialCode)[0]
            this.getMobileNumbCode(currentCode)
        },
        // 登录方式
        logType(status){
            this.logStatus = status;
            
            //this.initFormData();
            this.loginForm.password=''
            this.loginForm.checkCode=''
            //this.$refs.loginForm.resetFields();

        },
        initFormData(){
            this.loginForm =  {
                areaCode: '+971',
                phone: '',
                password: '',
                checkCode: ''
            }
        },
        // 滑块验证成功
        onMpanelSuccess(res, id){
            this.mpanelShow = false;
            this.handleLogin();
        },
        //获取国际区号
        getMobileNumbCode(code){
            this.loginForm.areaCode='+'+code.dialCode
            this.mobileNumbCode = code
            this.$bus.$emit('defaultCode', code);
            if(this.loginForm.phone){
                this.changeTel()
            }
        },
        getMobileNumbCode1(code){
            this.loginForm.areaCode='+'+code.dialCode
            this.mobileNumbCode = code
            this.$bus.$emit('defaultCode', code);
            this.$set(this.loginForm,'password', '')
            this.$set(this.loginForm,'phone', '')

        },
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        rememberPwd() {
            sessionStorage.setItem('remember', this.remember ? true : "");

        },
        toLogin(){
            this.account = this.appConfig.loginRegMethod === 1?this.loginForm.areaCode + this.loginForm.phone :  this.loginForm.account
            if(this.logStatus==2){

                this.handleLogin();
            }else{
                this.mpanelShow = true;
            }
        },
        getRandomString(length) {
            var s = '';
            do {
                s += Math.random().toString(36).substr(2);
            } while (s.length < length);
            s = s.substr(0, length);

            return s;
        },
        handleLogin() {
            const deviceDetector = new DeviceDetector();
            const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36";
            const device = deviceDetector.parse(userAgent);                 
            let computerName = require('computer-name')
            let NameDevice=computerName()
            let deviceVersion = device.os.version
            let machineId = machineIdSync({original: true})
            var md5Hash = CryptoJS.MD5(machineId,true);
            let md5MachineId = md5Hash.toString().substring(8).slice(0, -8);
            this.loginForm.deviceNo = md5MachineId
            this.loginForm.deviceVersion = deviceVersion
            this.loginForm.deviceName = NameDevice           
                    this.$store.dispatch('SetChatBox',false)
                    this.loading = true
                    this.loginForm.areaCode=this.appConfig.loginRegMethod === 1? "+" + this.mobileNumbCode.dialCode:''
                    let post = {...this.loginForm}
                    post.phone = this.appConfig.loginRegMethod === 1?post.phone.trim():''
                    // this.$set(this.loginForm,'phone',this.loginForm.phone.trim())
                    post.logStatus = this.logStatus;
                    
                    if(this.logStatus==2){
                        post.code = post.checkCode.trim()
                        // this.loginForm.code = this.loginForm.checkCode
                    }
                    post.account = this.appConfig.loginRegMethod === 1?post.areaCode + post.phone : post.account

                    // 如果需要记住密码  
                    if(this.remember){
                        let key = this.appConfig.loginRegMethod === 1?post.areaCode + post.phone : post.account
                        let value = this.encrypt(post.password)
                        // this.setLocalStorage(key, value)
                        sessionStorage.setItem(key, value)
                        if(this.appConfig.loginRegMethod === 1){
                            sessionStorage.setItem('codeRemeber',post.areaCode)
                            sessionStorage.setItem('AccountRemeber',post.phone)
                        }else{
                            sessionStorage.setItem('account',post.account)
                        }
                    }
                    // 后面需要传
                    // post.areaCode = this.mobileNumbCode.dialCode;
                    // console.log(post,'this.loginForm')
                    (async () => {
                        const [errLogin, dataLogin] = await this.awaitWrap(this.$store.dispatch('Login', post))                        
                        if(errLogin){
                            this.$message.error(errLogin)
                            this.loading = false
                            return
                        }
                        
                        
                        
                        // this.$message.success(this.$t('登录成功'))
                        // this.dbUser.getInstance().close()
                        // 好友，房间消息，请求完成之后才能接受离线消息
                        // Friends and Room information, The offline message cannot be accepted until the request completes
                        const [errInfo, dataInfo] = await this.awaitWrap(this.$store.dispatch('GetInfo'))
                        if(errInfo){
                            this.$message.error(errInfo)
                            return
                        }
                        // this.dbUser.getInstance().open()

                        
                        this.$store.dispatch('FindRoomRelation').then().catch(err=>{
                            this.$message.error(err)
                        })
                        
                        this.$store.dispatch('GetFriends').then().catch(err=>{
                            this.$message.error(err)
                        })
                        const [errInfos, dataInfos] = await this.awaitWrap(this.$store.dispatch('GetUserSessionList'))
                        if(errInfos){
                            this.$message.error(errInfo)
                        }
                        this.$store.dispatch('GetTeams').then().catch(err=>{
                            this.$message.error(err)
                        })
                        this.$store.dispatch('GetBatchs').then().catch(err=>{
                            this.$message.error(err)
                        })
                        let getInstance = chatInRoomsDAO.getInstance();                        
                        getInstance
                        .get()
                        .then((result) => {
                            this.$store.commit('SET_CHATIN_ROOMS', result)
                        })
                        .catch((e) => {
                            console.log("err_or: ", e);
                        });
                        let getInstanceNotice = NoticeMsgDAO.getInstance();
                        getInstanceNotice.getLast().then(async (result)=>{
                            let noticeMsg
                            if(result){
                                noticeMsg = {
                                        id: result.msgId,
                                }
                            }else{
                                noticeMsg = {
                                        id: 0,
                                }
                            }
                            const [err, resp] = await this.awaitWrap(this.$store.dispatch('GetOfflineNoticeMsgById', noticeMsg))
                        })
                        if(typeof this.getChatLocalMsgStore(4)=='object'){
                            this.$store.commit("SET_UNREAD_NUM", 0);
                        }
                        //this.$store.commit("SET_UNREAD_NUM", this.getChatLocalMsgStore(4) || 0);
                        this.$store.commit("SET_CUSTOM_FACE", this.getChatLocalMsgStore(6) || {});
                            this.$electron.ipcRenderer.send('logined')
                            this.$message.success(this.$t('login_Suc'))
                            this.loading = false
                            this.$router.push({
                                path: '/'
                            })
                        
                        IM();
                        
                    })()

        },
        toPath(path) {
            this.$router.push({
                path: '/' + path
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.im-select{
    display: flex;
    .labels{
        line-height: 35px;
        margin-right: 10px;
    }
    margin-bottom: 10px;
}
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #fff;
    user-select: none;
    .logclass{
        display:flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 15px;
        p{
            cursor: pointer;
            color: var(--primary-color);
            font-size: 14px;
            &.act{
                color: #999DA0;
                text-decoration: none;
            }
        }
        
    }
    .getCaptcha{
            position: absolute;
            top: 50%;
            right: 2px;
            transform: translate(0, -50%);
            background: #1BA440;
            height: 35px;
            line-height: 35px;
            padding: 0 8px;
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            font-weight: 100;
    }
    .getCaptchablue{
        background-color: #1BA440;
        cursor: pointer;
    }

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 275px;
        margin: 0 auto;
    }

    .title {
        margin-top: 100px;
        text-align: center;
        margin-bottom: 50px;
        img {
             width: 250px;
        }

        h3 {
            font-size: 24px;
            letter-spacing: 0px;
            color: #000;
            font-weight: 500;
            margin: 15px 0;

        }

        h5 {
            margin-top: 12px;
            margin-bottom: 60px;
            font-size: 14px;
            letter-spacing: 0px;
            color: #333333;

            span {
                color: #1ab2ff;
                cursor: pointer;
            }
        }
    }

    .el-input {
        display: inline-block;
        height: 38px;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 0;
            color: #333;
            height: 38px;

            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }

    .el-form-item {
        margin-bottom: 20px;
        border: 0;
        border-bottom: 1px solid #f2f2f2;
        background: #fff;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;
        user-select: none;
        width: 14px;
    }

    .pwd-style {
        display: flex;
        margin-bottom: 30px;
        justify-content: center;

        .remember-pwd {

            cursor: pointer;

            img {
                width: 12px;
                vertical-align: middle;
            }

            span {
                margin-left: 5px;
                font-size: 14px;
                color: #333333;
                vertical-align: middle;
            }
        }

        .forget-pwd {
            flex: 1;
            margin-top: 3px;
            text-align: right;
            font-size: 14px;
            color: var(--primary-color);

            span {
                position: relative;
                cursor: pointer;

                

            }

        }
    }

    .to-registered {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #000;

        span {
            color: var(--primary-color);
            position: relative;
            cursor: pointer;

            
        }
    }
    .el-input-group--prepend{
        display: flex;
    }

}

.is-disabled {
    opacity: 0.4;
}

/deep/ .el-form-item__content .el-button {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: none;
}
/deep/.el-input {
    .el-input-group__prepend{
        padding: 0;
        border: none;
        width: 70px;
    }
    .el-input__inner{
        height: 38px;
    }
}


</style>
