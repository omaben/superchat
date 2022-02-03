<template>
    <el-container class="profile-info">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('answerSecurityQuestion')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('submit')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('oldSecretSecProblem')}}
                            </p>
                            <div class="update-input">
                                <el-form-item  prop="oldQus">
                                    <el-select v-model="ruleForm.oldQus" :placeholder="$t('oldSecretSecProblem')">
                                        <el-option v-for="item in qusList" :key="item.id" :label="item.question"
                                            :value="item.id"> </el-option>
                                    </el-select>
                                </el-form-item>
                                
                            </div>
                            <p>{{$t('forgetSecurity')}}</p>
                            <div class="update-input">
                                <el-form-item prop="oldAns">
                                    <el-input v-model="ruleForm.oldAns" :placeholder="$t('inp_oldSecretAnswer')"></el-input>
                                </el-form-item>
                            </div>
                            <div class="forget-securite" @click="feedBackS()">
                                    <span>{{$t('forgetSecurity')}}</span>
                            </div>
                        </div>
                </el-main>
        </el-form>
        <el-dialog :visible.sync="feedbackContent" :title="$t('SetPasswordHelpVC_title')">
                <el-form>
                    <el-form-item>
                        <el-input v-model="content"></el-input>
                        <el-button  type="primary" style="width:100%;margin-top:25px" :loading="loading" @click.native.prevent="feedbackSecurite">
                            {{$t('confirm')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
    </el-container>   
</template>
<script>
import fData from '@/app.config';
import {mapGetters} from 'vuex';
import newAccount from "./newAccount";
import {
    safeGetQuestion,
    safeQueryQuestion,
    accountFeedback,
    accountCheckAnswer
} from '@/services'

export default {
    data() {
        return {
            loading: false,
            sex: 1,
            content:'',
            showChange: false,
            feedbackContent:false,
            qusData: {},
            qusList: [],
            oldQusPro: '',
            ruleForm: {
                newQus: '',
                newAns: '',
                oldQus: '',
                oldAns: '',
            },
            rules: {
                newQus: fData.MUST,
                newAns: fData.MUST,
                oldQus: fData.MUST,
                oldAns: fData.MUST,
            },
                

        }
    },
    components: {
        newAccount
    },
    mounted() {
        this.getUserQus()
        this.getAllQus()

    },
    computed: {
            ...mapGetters([
                'userInfo'
            ])
    },
    methods: {
        nameBack(boolean,val) {
                this.showChange = false;
            },
        submitForm(){
            let phone =this.userInfo.account.replace("+971","");
                let post = {
                    areaCode: "+971",
                    phone: phone,
                    answer: this.ruleForm.oldAns
                }
                accountCheckAnswer(post).then(res=>{
                    
                    if(res.success){
                        this.showChange=1
                    }
                })
        },
        getUserQus(){
            safeGetQuestion().then(res => {
                if(res && res.success){
                    let qusData = res.data || {};
                    this.qusData = qusData;
                    this.oldQusPro = qusData.question || '';
                    this.$set(this.ruleForm,'oldQus', qusData.question)
                }
            })
        },
        feedBackS(){
            this.feedbackContent=true
        },
        feedbackSecurite(){
            let post = {
                reaCode: '+' + sessionStorage.getItem('codeRemeber'),
                phone: sessionStorage.getItem('AccountRemeber'),
                content: this.content
            }
            accountFeedback(post).then(res => {
                if(res.success){
                    this.feedbackContent=false
                }
            })
        },
        getAllQus(){
            safeQueryQuestion().then(res => {
                if(res.success){
                    this.qusList = res.data || [];
                    // this.ruleForm.newQus = this.qusList[0].id
                    this.$set(this.ruleForm,'newQus',this.qusList[0].id)
                }else{
                    this.$message.error(res.message)
                }
            })
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
.el-select{
                width: 100%;
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
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 20px;
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
.profile-info{
        font-size: 14px;
        .el-header{
            background: #fff;
            color: #000;
            text-align: center;
            line-height: 60px;
            text-transform: capitalize;
            font-size: 18px;
            cursor: pointer;
            
        }
        .el-main{
            background: #F0F3F4 !important;
            height: calc(100vh - 60px);
            padding-top: 25px;
            .el-input__inner{
                border: none;
            }
        }
    }
    form.el-form.demo-ruleForm{
        width: 100%;
    }
</style>