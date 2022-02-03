<template>
    <div>
        <vue-country-code @onSelect="onSelectCountry" style="display:none"></vue-country-code>
        
        <div class="check-container">
            <el-dropdown class="lang-update" trigger="click" @command="changeLang">
            <span class="el-dropdown-link">
                <img  :src="require('@/assets/svg/language.svg')" alt="">

                {{$t('select_language')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in rootConfig.langArr" :command="item.value" :key="item.value" :class="{'active':lang === item.value}">{{item.key}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
            <el-form class="check-form" autoComplete="on" :model="checkForm" :rules="checkRules" ref="checkForm" label-position="left">
                <div class="title">
                    <img  :src="require('@/assets/svg/logo.png')" alt="">
                    <!-- <h3>
                        {{$t('welcomeToChaoxin')}}
                    </h3> -->

                </div>
                
                <el-form-item prop="phone" class="actInput">
                    <el-input name="phone" type="text" 
                        v-model="checkForm.phone" @keyup.native="changeTel" @focus="changeTelfocus"
                        autoComplete="on" :placeholder="$t('account')">
                        <template slot="prepend">
                            <IntlTelInput @excountry="getMobileNumbCode"  @excountry1="getMobileNumbCode" :countryCode="'vn'" class="mobileSelect"></IntlTelInput>
                        </template>
                    </el-input>
                    <img class="show-pwd" v-show="checkForm.phone" @click="checkForm.phone = ''" src="@/assets/icon_del.png" alt="">
                </el-form-item>

                <el-form-item :label="$t('secQue')" prop="question" v-if="quesData.question">
                    <el-select v-model="quesData.question" :placeholder="$t('secQue')">
                        <el-option v-for="item in qusList" :key="item.id" :label="item.question"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('claAns')" prop="answer" v-if="quesData.question">
                    <el-input name="answer" type="text" v-model="checkForm.answer" autoComplete="on" :placeholder="$t('answer')" />
                    <img class="show-pwd" v-show="checkForm.answer" @click="checkForm.answer = ''" src="@/assets/icon_del.png" alt="">
                </el-form-item>
                <div v-else class="forget-tip">
                    {{$t('forfgetDesc1')}}<br />
                    {{$t('forfgetDesc2')}}
                </div>
                <div class="forget-securite" @click="feedBackS()" >
                    <span>{{$t('forgetSecurity')}}</span>
                </div>
                <el-form-item>
                    <el-button :disabled="!quesData.question" type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleSet">
                        {{$t('next')}}
                    </el-button>
                </el-form-item>
            </el-form>
            
            <p class="back" @click="toPath('loginPhone')">{{$t('cancel')}}</p>
        </div>
        <el-dialog :visible.sync="feedbackContent" :title="$t('SetPasswordHelpVC_title')">
            <el-form>
                <el-form-item  >
                    <el-input 
                        type="textarea"
                        :rows="5"
                        :placeholder="$t('SetPasswordHelpVC_message_text')"
                        v-model="content">
                    </el-input>
                    <el-button  type="primary" style="width:100%;margin-top:25px" :loading="loading" @click.native.prevent="feedbackSecurite">
                        {{$t('confirm')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import countries from '@/components/IntlTelInput/countryList'
import IntlTelInput from "@/components/IntlTelInput/IntlTelInput1";
import fData from '@/app.config';
import {
    accountSafeQuestion,
    accountCheckAnswer,
    accountFeedback,
    safeQueryQuestion,
} from '@/services'

export default {
    name: 'login',
    components: {
        IntlTelInput
    },
    data() {
        return {
            lang: sessionStorage.getItem('local') || 'zh',
            countries: countries,
            content:'',
            quesData: {},
            feedbackContent:false,
            checkForm: {
                phone: '',
                answer: '',
                question: ''
                
            },
            checkRules: {
                // phone: fData.MUST,
                answer: fData.MUST,
                question: fData.MUST
            },
            loading: false,
            pwdType: 'password',
            mobileNumbCode: {},
            qusList: [],
            ruleForm: {
                newQus: '',
                newAns: '',
                oldQus: '',
                oldAns: '',
            },

        }
    },
    mounted() {
        this.getAllQus()
    },
    methods: {
        changeLang(data) {
            sessionStorage.setItem('local', data)
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || ''
            this.ipcRenderer.send("changeLang", data, userInfo);
        },
        getAllQus(){
            safeQueryQuestion().then(res => {
                if(res.success){
                    this.qusList = res.data || [];
                    // this.ruleForm.newQus = this.qusList[0].id
                    if(this.qusList.length>0){
                        this.$set(this.ruleForm,'newQus',this.qusList[0].id)
                    }
                }else{
                    this.$message.error(res.message)
                }
            })
        },
        getQues(){
            if(!this.checkForm.phone)return
            
            let post = {
                areaCode: "+" + this.mobileNumbCode.dialCode,
                phone: this.checkForm.phone
            }
            accountSafeQuestion(post).then(res => {
                if(res.success){
                    
                    this.quesData = res.data || {}
                    this.checkForm.question = this.quesData.question
                }else{
                    this.quesData = {}
                }
            })

        },
        changeTelfocus() {
            this.checkForm.phone = (/[^0-9]/g.test(this.checkForm.phone)) ? '' : this.checkForm.phone;
        },
        changeTel() {
            this.checkForm.phone = this.checkForm.phone.replace(/[^0-9]/g, '');
            if(!this.checkForm.phone)return
            
            this.getQues()
        },
        feedBackS(){
            this.feedbackContent=true
        },
        feedbackSecurite(){
            let post = {
                areaCode:  "+" + this.mobileNumbCode.dialCode,
                phone: this.checkForm.phone,
                content: this.content
            }
            accountFeedback(post).then(res => {
                if(res.success){
                    this.feedbackContent=false
                    this.$message.success(res.message)
                }
            })
        },
        onSelectCountry({name, iso2, dialCode}) {
            let currentCode=this.countries.filter((item)=>item.dialCode==dialCode)[0]
            this.getMobileNumbCode(currentCode)
        },
        //获取国际区号
        getMobileNumbCode(code){
            this.mobileNumbCode = code
            this.$bus.$emit('defaultCode', code);
        },
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        handleSet() {
            this.$refs.checkForm.validate(valid => {
                if (valid) {
                    let post = {
                        answer: this.checkForm.answer,
                        areaCode:  "+" + this.mobileNumbCode.dialCode,
                        phone: this.checkForm.phone,
                    }
                    this.loading = true
                    accountCheckAnswer(post).then(res => {
                        if(res.success){
                            this.$router.push({
                                path: '/setPWD',
                                query: {
                                    areaCode: post.areaCode,
                                    phone: this.checkForm.phone
                                }
                            });
                        }else{
                            this.$message.error(res.message)
                        }
                        this.loading = false
                    })

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        toPath(path) {
            if (path == -1) {
                this.$router.go(-1);
            } else {
                this.$router.push({
                    path: '/' + path
                });
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.check-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #fff;
    user-select: none;

    .check-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 275px;
        margin: 0 auto;
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
    .forget-tip{
        font-size: 14px;
        color: #666;
        line-height: 1.5;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 72%;
        transform: translate(0, -50%);
        cursor: pointer;
        user-select: none;
        width: 14px;
    }

    .back {
        position: absolute;
        bottom: 32px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: var(--primary-color);
        cursor: pointer;
        font-weight: bold;

    }
    .el-input-group--prepend{
        display: flex;
    }

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

.el-select {
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
}

.is-disabled {
    opacity: 0.4;
}

/deep/ .el-form-item__content .el-button {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: none;
}
.forget-securite {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: var(--primary-color);
            margin-bottom: 19px;
            margin-top: 10px;

            span {
                position: relative;
                cursor: pointer;

                

            }

        }
</style>
