<template>
    <el-container class="profile-info">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" v-if="!showChange">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('verifyPhone')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('Update')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('A verification Code has been sent to your registered number.')}}
                            </p>
                            <div class="update-input">
                                <el-form-item prop="oldAns" class="codeSms">
                                    <el-input v-model="ruleForm.sms" placeholder="Enter SMS Code" class="smsInput"></el-input>
                                    <el-button type="primary" @click="resendSms()" :disabled="crono>0">{{$t('Get Code')}}</el-button>
                                    <div class="chrono" v-show="crono>0">Receiving another code in 00.{{cronoText}}</div> 
                                </el-form-item>
                            </div>
                        </div>
                </el-main>
        </el-form>
        <new-account v-if="showChange == 1" @childBack="nameBack"></new-account>
    </el-container>
    
</template>
<script>
import {mapGetters} from 'vuex';
import newAccount from "./newAccount";
import {
    phoneCode,phoneCodeVer
} from '@/services'

export default {
    components: {
        newAccount
    },
    data() {
        return {
            showChange: false,
            sex: 1,
            content:'',
            feedbackContent:false,
            qusData: {},
            qusList: [],
            oldQusPro: '',
            cronoText:'59',
            ruleForm: {
                sms: ''
            },
            crono:59    

        }
    },
    mounted() {
        this.sendSmsVerification()
        let that = this
         setInterval(function (){
             if(that.crono>0){
                that.chrono()
             }
         }, 1000);
    },
    computed: {
            ...mapGetters([
                'userInfo'
            ])
    },
    methods: {
        sendSmsVerification(){
                let post = {
                    phone: "+" + sessionStorage.getItem('codeRemeber') + sessionStorage.getItem('AccountRemeber'),
                    isLogin: 2,
                }
                
                phoneCode(post).then(res=>{
                    console.log(res,'test')
                })
            },
        back() {
                this.$emit('childBack', false)
            },
        nameBack(boolean,val) {
                this.showChange = false;
            },
        resendSms(){
                let post = {
                    phone: "+" + sessionStorage.getItem('codeRemeber') + sessionStorage.getItem('AccountRemeber'),
                    isLogin: 2,
                }
                phoneCode(post).then(res=>{
                    if(res.success){
                        this.crono=59
                        this.cronoText='59'
                    }
                    else{
                        this.$message.error(res.message)
                    }
                })
        },
        submitForm(){
                let post = {
                    phone: '+' + sessionStorage.getItem('codeRemeber') + sessionStorage.getItem('AccountRemeber'),
                    code: this.ruleForm.sms
                }
                phoneCodeVer(post).then(res=>{
                    if(res.success){
                        this.showChange=1
                    }
                    else{
                        this.$message.error(res.message)
                    }
                })
        },
        chrono(){
           
                this.crono=this.crono-1
                if(this.crono>9){
                    this.cronoText=this.crono
                }else{
                    this.cronoText='0'+this.crono
                }
        },
        ressendSms(){

        },
        
        back() {
                this.$emit('childBack', false)
            },

       
        
    },
}
</script>

<style lang='scss' scoped>
.safe-pass{
    display: block;
    align-items: center;
    font-size: 16px;
    background: #fff;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    h5 {
            font-size: 16px;
            color: #333;
            cursor: pointer;
            margin-bottom: 30px;
            width: 100%;
            i {
                vertical-align: middle;
                margin-right: 10px;
                font-size: 20px;
            }
        }
    .el-form{
        width: 100%;
    }
    .input-style {
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .sub-btn {
        margin-top: 50px;

        button {
            width: 120px;
            float: right;
        }
    }

}
.forget-securite {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #1ab2ff;
            margin-bottom: 19px;

            span {
                position: relative;
                cursor: pointer;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 90%;
                    height: 1px;
                    background: #1ab2ff;
                }

            }

        }
.v-modal{
    display: none!important;
}
.el-form-item.codeSms button.el-button.el-button--primary {
    z-index: 1;
    position: absolute;
    right: 0;
    border: none!important;
    background: initial;
    color: var(--primary-color);
    padding-right: 9px;
    &.is-disabled {
        color: #E0E3E5;
    }
}

.chrono {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #999DA0;
}
.update-box {
    position: relative;
    width: 500px;
    margin: 0 auto;

    h5 {
        font-size: 16px;
        color: #333;
        cursor: pointer;

        i {
            vertical-align: middle;
            margin-right: 10px;
            font-size: 20px;
        }
    }

    p {
        font-size: 14px;
        color: #999DA0;
        margin-bottom: 15px;
    }

    .update-input {
        border: none;
        border-radius: 5px;
        .el-form-item{
            margin: 0 !important;
        }
       
    }

    .sub-btn {
        margin-top: 20px;

        button {
            width: 120px;
        }
    }
}
    .el-main{
        background: #F0F3F4 !important;
        height: calc(100vh - 60px);
        padding-top: 25px;
        .el-input__inner{
            border: none;
        }
    }
    form.el-form.demo-ruleForm{
        width: 100%;
    }
</style>