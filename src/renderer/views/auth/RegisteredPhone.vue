<template>
    <div class="login-container">
        <vue-country-code
            @onSelect="onSelectCountry"
            style="display:none"
        ></vue-country-code>
        <el-dropdown class="lang-update" trigger="click" @command="changeLang">
            <span class="el-dropdown-link">
                <img :src="require('@/assets/svg/language.svg')" alt="" />

                {{ $t("select_language")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="item in rootConfig.langArr"
                    :command="item.value"
                    :key="item.value"
                    :class="{ active: lang === item.value }"
                    >{{ item.key }}</el-dropdown-item
                >
            </el-dropdown-menu>
        </el-dropdown>

        <el-form
            class="login-form"
            autoComplete="on"
            :model="registerForm"
            :rules="registerRules"
            ref="registerForm"
            label-position="left"
        >
            <!-- <div class="title">
                <img src="@/assets/icon_zhuce_top.png" alt="">
                <h3>
                    {{$t('weForChaoxin')}}
                </h3>
                <h5>{{$t('signUpToAgree')}} <span @click="userAgreement=true">{{$t('userAgreement')}}</span></h5>
            </div> -->
            <div class="title">
                <img :src="require('@/assets/svg/logo.png')" alt="" />
                <!-- <h3>
                    {{$t('welcomeToChaoxin')}}
                </h3> -->
            </div>
            <div v-show="!checkSms && appConfig.loginRegMethod === 1">
                <el-form-item prop="mobileNumb" class="intl">
                    <el-input
                        name="mobileNumb"
                        type="text"
                        v-model="registerForm.mobileNumb"
                        autoComplete="on"
                        :placeholder="mobileNumbCode.phoneFormat"
                        :maxlength="mobileNumbCode.lenght"
                        @keyup.native="changeTel"
                        @focus="changeTelfocus"
                        :disabled="getPhoneCode || !smsSendActive"
                    >
                        <template slot="prepend">
                            <IntlTelInput
                                @excountry="getMobileNumbCode"
                                @excountry1="getMobileNumbCode"
                                :countryCode="'ae'"
                                class="mobileSelect"
                            ></IntlTelInput>
                        </template>
                    </el-input>
                    <img
                        class="show-pwd"
                        v-show="registerForm.mobileNumb && !getPhoneCode"
                        @click="clearRegister()"
                        src="@/assets/icon_del.png"
                        alt=""
                    />
                    <p v-if="!VerifyAccount" class="text-error-verify ">
                        {{ MessageVerifyAccount }}
                    </p>
                </el-form-item>
                <el-form-item prop="checkCode">
                    <el-input
                        name="checkCode"
                        @keyup.native="lenghtSMS()"
                        :disabled="!VerifyAccount || !smsSendActive"
                        type="number"
                        :placeholder="$t('p_VerCode')"
                        v-model="registerForm.checkCode"
                        autoComplete="on"
                    ></el-input>
                    <div
                        class="getCaptcha"
                        v-if="VerifyAccount"
                        :class="{ getCaptchablue: registerForm.mobileNumb }"
                        @click="sendMessage"
                    >
                        {{ phoneCodeText }}
                    </div>
                    <p
                        v-if="!checkSms"
                        v-show="showVerifySms"
                        class="text-error-verify"
                    >
                        {{ MessageVerifySMS }}
                    </p>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        style="width:100%;"
                        @click="verifySms()"
                        :disabled="!smsLenght"
                    >
                        {{ $t("next") }}
                    </el-button>
                </el-form-item>
            </div>
            <div
                v-show="checkSms || appConfig.loginRegMethod === 2"
                class="PasswordRegister"
            >
                <el-form-item
                    prop="account"
                    v-if="appConfig.loginRegMethod === 2"
                >
                    <el-input
                        name="account"
                        type="text"
                        :placeholder="$t('account')"
                        v-model="registerForm.account"
                        autoComplete="on"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password" class="pwd">
                    <el-input
                        name="password"
                        :disabled="!checkSms && appConfig.loginRegMethod != 2"
                        :type="pwdTypes"
                        :placeholder="$t('p_pwd')"
                        v-model="registerForm.password"
                        autoComplete="on"
                    ></el-input>
                    <img
                        class="pwds"
                        v-show="!pwdTypes"
                        @click="showPwds"
                        src="@/assets/icon_eye_xs.png"
                        alt=""
                    />
                    <img
                        class="pwds"
                        v-show="pwdTypes"
                        @click="showPwds"
                        src="@/assets/icon_eye_yc.png"
                        alt=""
                    />
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input
                        name="confirmPassword"
                        :disabled="!checkSms && appConfig.loginRegMethod != 2"
                        :type="pwdType"
                        @keyup.enter.native="handleRegister"
                        v-model="registerForm.confirmPassword"
                        autoComplete="on"
                        :placeholder="$t('againInpPwd')"
                    ></el-input>
                    <img
                        class="show-pwd"
                        v-show="!pwdType"
                        @click="showPwd"
                        src="@/assets/icon_eye_xs.png"
                        alt=""
                    />
                    <img
                        class="show-pwd"
                        v-show="pwdType"
                        @click="showPwd"
                        src="@/assets/icon_eye_yc.png"
                        alt=""
                    />
                </el-form-item>
                <el-form-item
                    prop="promotionCode"
                    v-if="appConfig.promotionCodeSettings != 0"
                >
                    <el-input
                        name="promotionCode"
                        v-model="registerForm.promotionCode"
                        type="text"
                        :placeholder="$t('PromotionCode')"
                    ></el-input>
                </el-form-item>
                <div class="pwd-style"></div>
                <el-form-item style="text-align:center;padding-bottom:20px">
                    <el-button
                        type="primary"
                        style="width:40%;"
                        @click="backSMS()"
                        v-show="smsLenght"
                    >
                        {{ $t("back") }}
                    </el-button>
                    <el-button
                        type="primary"
                        style="width:40%;"
                        :disabled="
                            (!registerForm.mobileNumb &&
                                !registerForm.account) ||
                                !registerForm.password ||
                                (!registerForm.promotionCode &&
                                    appConfig.promotionCodeSettings === 2) ||
                                (!checkSms && appConfig.loginRegMethod === 1)
                        "
                        :loading="loading"
                        @click.native.prevent="handleRegister"
                    >
                        {{ $t("register") }}
                    </el-button>
                </el-form-item>
            </div>
            <p class="to-registered">
                {{ $t("alAct") }}？<span @click="toPath('loginPhone')">{{
                    $t("logInIms")
                }}</span>
            </p>
        </el-form>
        <div class="user-agreement-link">
            <p>{{ $t("signUpToAgree") }}</p>
            <p @click="userAgreement = true" class="link-agreement">
                {{ $t("userAgreement") }}
            </p>
        </div>
        <!-- 验证码 start -->
        <Mpanels
            :type="1"
            v-if="mpanelShow"
            @success="onMpanelSuccess"
            @close="mpanelShow = false"
        ></Mpanels>
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
import countries from "@/components/IntlTelInput/countryList";
import IntlTelInput from "@/components/IntlTelInput/IntlTelInput1";
import Mpanels from "@/components/Mpanels.vue"; //验证
import { phoneCode, phoneCodeVer, getElseMail } from "@/services/index";
import fData from "@/app.config";
import IM from "@/services/im/connect";
import { machineId, machineIdSync } from "node-machine-id";
import CryptoJS from "crypto-js";
import DeviceDetector from "device-detector-js";

import { checkRegister } from "@/services";
export default {
    name: "registeredPhone",
    components: {
        IntlTelInput,
        Mpanels,
    },
    data() {
        let validateAccount = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("mustY")));
            } else if (!fData.actValidateError.test(value)) {
                callback(new Error(this.$t("account_str")));
            } else {
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("mustY")));
            } else if (!fData.operationpassError.test(value)) {
                callback(new Error(this.$t("pwd_str")));
            } else {
                if (this.registerForm.confirmPassword !== "") {
                    this.$refs.registerForm.validateField("confirmPassword");
                }
                callback();
            }
        };

        let validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("againInpPwd")));
            } else if (value !== this.registerForm.password) {
                callback(new Error(this.$t("noSamePwd")));
            } else {
                callback();
            }
        };
        let account = [
            { required: true, message: this.$t("mustY"), trigger: "blur" },
            { validator: validateAccount, trigger: "blur" },
        ];
        let password = [
            { required: true, message: this.$t("mustY"), trigger: "blur" },
            { validator: validatePass, trigger: "blur" },
        ];
        let confirmPassword = [
            { required: true, message: this.$t("mustY"), trigger: "blur" },
            { validator: validatePass2, trigger: "blur" },
        ];

        return {
            lang: sessionStorage.getItem("local") || "zh",
            appConfig: "",
            logStatus: 1,
            countries: countries,
            userAgreement: false,
            registerForm: {
                account: "",
                mobileNumb: "",
                password: "",
                confirmPassword: "",
                checkCode: "",
                promotionCode: "",
            },
            showVerifySms: false,
            checkSms: false,
            smsLenght: false,
            registerRules: {
                /* mobileNumb: fData.MUST, */
                account:account,
                password: password,
                confirmPassword: confirmPassword,
            },
            loading: false,
            smsSendActive: true,
            pwdType: "password",
            pwdTypes: "password",
            mobileNumbCode: "",
            phoneCodeText: this.$t("get_VerCode"),
            getPhoneCode: false,
            MessageVerifyAccount: "",
            MessageVerifySMS: "",
            VerifyAccount: true,
            // 图形验证码 start
            mpanelShow: false,
            code: "",
            // codeInfo: {},
            loginIng: false,
            // 图形验证码 end
        };
    },
    mounted() {
        this.appConfig = JSON.parse(sessionStorage.getItem("appConfig"));
    },
    methods: {
        changeLang(data) {
            sessionStorage.setItem("local", data);
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || "";
            this.ipcRenderer.send("changeLang", data, userInfo);
        },
        logType(status) {
            this.logStatus = status;
        },
        // 验证通过
        clearRegister() {
            this.registerForm.mobileNumb = "";
            this.registerForm.promotionCode = "";
            this.VerifyAccount = false;
            this.MessageVerifyAccount = "";
        },
        lenghtSMS() {
            if (this.registerForm.checkCode.length === 6) {
                this.smsLenght = true;
            } else {
                this.smsLenght = false;
            }
        },
        backSMS() {
            this.checkSms = false;
        },
        verifySms() {
            if (this.registerForm.checkCode.length == 6) {
                this.showVerifySms = true;
            } else {
                this.showVerifySms = false;
            }
            let post = {
                phone:
                    "+" +
                    this.mobileNumbCode.dialCode +
                    this.registerForm.mobileNumb,
                code: this.registerForm.checkCode,
            };

            if (this.smsSendActive) {
                phoneCodeVer(post).then((res) => {
                    if (res.success) {
                        this.checkSms = true;
                        this.smsSendActive = false;
                    } else {
                        this.MessageVerifySMS = res.message;
                        this.checkSms = false;
                    }
                });
            } else {
                this.checkSms = true;
            }
        },
        VerifyRegister() {
            this.registerForm.account = this.registerForm.mobileNumb
                ? "+" +
                  this.mobileNumbCode.dialCode +
                  this.registerForm.mobileNumb
                : this.registerForm.account;

            let post = {
                //areaCode: "+971",
                account: this.registerForm.account,
            };
            checkRegister(post).then((res) => {
                this.VerifyAccount = res.success;
                this.MessageVerifyAccount = res.message;
            });
        },
        onMpanelSuccess(res, id) {
            // this.code = back + "";
            // this.codeInfo.id = id;
            this.mpanelShow = false;
            this.doShortMsg();
        },

        changeTelfocus() {
            this.registerForm.mobileNumb = /[^0-9]/g.test(
                this.registerForm.mobileNumb
            )
                ? ""
                : this.registerForm.mobileNumb;
        },
        changeTel() {
            this.registerForm.mobileNumb = this.registerForm.mobileNumb.replace(
                /[^0-9]/g,
                ""
            );
            this.VerifyRegister();
        },
        //获取短信验证码
        sendMessage() {
            if (!this.registerForm.mobileNumb) {
                this.$message.error(this.$t("p_phone"), {
                    cover: true,
                    duration: 1000,
                });
                return;
            } else if (!this.getPhoneCode) {
                this.mpanelShow = true;
            }
        },
        countDown(data) {
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
                this.phoneCodeText = this.$t("get_VerCode");
                this.smsSendActive = true;
                wait = _wait;
            } else {
                this.getPhoneCode = true;
                this.phoneCodeText = wait + "s";

                wait--;
                setTimeout(() => {
                    _this.getSecond(wait);
                }, 1000);
            }
        },
        onSelectCountry({ name, iso2, dialCode }) {
            let currentCode = this.countries.filter(
                (item) => item.dialCode == dialCode
            )[0];
            this.getMobileNumbCode(currentCode);
        },
        //获取国际区号
        getMobileNumbCode(code) {
            this.mobileNumbCode = code;
            this.$bus.$emit("defaultCode", code);
        },
        showPwd() {
            if (this.pwdType === "password") {
                this.pwdType = "";
            } else {
                this.pwdType = "password";
            }
        },
        showPwds() {
            if (this.pwdTypes === "password") {
                this.pwdTypes = "";
            } else {
                this.pwdTypes = "password";
            }
        },
        //
        doShortMsg() {
            let post = {
                // phone: this.registerForm.mobileNumb,
                //areaCode: "+971",
                phone:
                    "+" +
                    this.mobileNumbCode.dialCode +
                    this.registerForm.mobileNumb,
                isLogin: 2,
            };
            phoneCode(post).then((res) => {
                if (res.success) {
                    this.countDown();
                    /* if(JSON.parse(res.data).code == 200){
                    let url = `/GetPhoneCode?+${this.mobileNumbCode.dialCode}${this.registerForm.mobileNumb}`
                    getElseMail(url).then(res => {
                        console.log("code: ", res.data);
                    })

                }else{
                    this.$message.error(res.message)
                }  */
                }
            });
        },
        handleRegister() {
            if (this.loading) return;
            const deviceDetector = new DeviceDetector();
            const userAgent =
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36";
            const device = deviceDetector.parse(userAgent);
            let deviceVersion = device.os.version;
            let computerName = require("computer-name");
            let NameDevice = computerName();
            let machineId = machineIdSync({ original: true });
            var md5Hash = CryptoJS.MD5(machineId, true);
            let md5MachineId = md5Hash
                .toString()
                .substring(8)
                .slice(0, -8);
            this.registerForm.deviceNo = md5MachineId;
            this.registerForm.deviceVersion = deviceVersion;
            this.registerForm.deviceName = NameDevice;
            this.registerForm.account = this.registerForm.mobileNumb
                ? "+" +
                  this.mobileNumbCode.dialCode +
                  this.registerForm.mobileNumb
                : this.registerForm.account;
            let post = {
                ...this.registerForm,
                // phone: this.registerForm.mobileNumbCode,
                areaCode: "+" + this.mobileNumbCode.dialCode,
                //areaCode: "+971",
                phone: this.registerForm.mobileNumb,
            };
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    // return
                    // this.$store.dispatch('RegisterUser', post).then(res => {
                    //     this.$message.success('注册成功')
                    //     // localStorage.setItem('isReload',true)
                    //     this.$router.push('/')
                    //     this.$electron.ipcRenderer.send('logined')
                    //     this.loading = false
                    // }).catch(err => {
                    //     this.loading = false
                    //     this.$message.error(err)
                    // })
                    (async () => {
                        this.loading = true;
                        const [errLogin, dataLogin] = await this.awaitWrap(
                            this.$store.dispatch("RegisterUser", post)
                        );
                        if (errLogin) {
                            this.$message.error(errLogin);
                            this.loading = false;
                            return;
                        }
                        this.loading = false;
                        this.$router.push({
                            path: "/",
                        });
                        this.$electron.ipcRenderer.send("logined");
                        // this.$message.success('登录成功')
                        this.$message.success(this.$t("login_Suc"));
                        // 好友，房间消息，请求完成之后才能接受离线消息
                        // Friends and Room information, The offline message cannot be accepted until the request completes
                        const [errInfo, dataInfo] = await this.awaitWrap(
                            this.$store.dispatch("GetInfo")
                        );
                        if (errInfo) {
                            this.$message.error(errInfo);
                        }
                        const [errInfos, dataInfos] = await this.awaitWrap(
                            this.$store.dispatch("GetUserSessionList")
                        );
                        if (errInfos) {
                            this.$message.error(errInfo);
                        }

                        this.$store
                            .dispatch("FindRoomRelation")
                            .then()
                            .catch((err) => {
                                this.$message.error(err);
                            });

                        this.$store
                            .dispatch("GetFriends")
                            .then()
                            .catch((err) => {
                                this.$message.error(err);
                            });
                        this.$store
                            .dispatch("GetTeams")
                            .then()
                            .catch((err) => {
                                this.$message.error(err);
                            });
                        // const [errOffLine, dataOffLine] = await this.awaitWrap(this.$store.dispatch('GetOffLineMsg'))
                        // if(errOffLine){
                        //     this.$message.error(errOffLine)
                        //     return
                        // }
                        IM();
                    })();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        toPath(path) {
            this.$router.push({
                path: "/" + path,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #fff;
    user-select: none;
    .logclass {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 15px;
        p {
            cursor: pointer;
            &.act {
                color: #1ab2ff;
                text-decoration: underline;
            }
        }
    }
    .getCaptcha {
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translate(0, -50%);
        background: #1ba440;
        height: 35px;
        line-height: 35px;
        padding: 0 8px;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        font-weight: 100;
    }
    .getCaptchablue {
        background-color: #1ba440;
        cursor: pointer;
    }

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 275px;
        margin: 0 auto;
        .pwd {
            position: relative;
            .pwds {
                position: absolute;
                right: 10px;
                top: 25px;
                transform: translate(0, -50%);
                cursor: pointer;
                user-select: none;
                width: 14px;
            }
        }
    }

    .title {
        margin-top: 150px;
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
            color: #1ab2ff;

            span {
                position: relative;
                cursor: pointer;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 90%;
                    height: 1px;
                    background: #1ab2ff;
                }
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

    .el-input-group--prepend {
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
    .el-input-group__prepend {
        padding: 0;
        border: none;
        width: 70px;
    }
    .el-input__inner {
        height: 38px;
    }
}

.text-error-verify {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    right: 0;
}
.user-agreement h1 {
    font-weight: bold;
    font-size: 15pt;
}
</style>
