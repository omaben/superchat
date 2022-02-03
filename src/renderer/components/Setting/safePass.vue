<template>
    <el-container class="profile-info">
            <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" label-width="110px" style="width:100%">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('secQues')}}</p>
                         <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('Update')}}</el-button>
                        </div> 
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="safe-pass update-box">
        
                            <span v-if="qusData.id">
                                <p>{{$t('oldSecretSecProblem')}}</p>
                                <el-form-item prop="oldQus">
                                    <el-input v-model="ruleForm.oldQus" disabled></el-input>
                                </el-form-item>
                                <p>{{$t('inp_oldSecretAnswer')}}</p>
                                <el-form-item  prop="oldAns">
                                    <el-input v-model="ruleForm.oldAns" ></el-input>
                                    
                                </el-form-item>
                                <div class="forget-securite" @click="feedBackS()">
                                    <span>{{$t('forgetSecurity')}}</span>
                                </div>
                            </span>
                            <p>{{$t('newSecretSecIssue')}}</p>
                            <el-form-item prop="newQus">
                                <el-select v-model="ruleForm.newQus" >
                                    <el-option v-for="item in qusList" :key="item.id" :label="item.question"
                                        :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                           <p>{{$t('inp_newSecretAnswer')}}</p> 
                            <el-form-item prop="newAns">
                                <el-input v-model="ruleForm.newAns" ></el-input>
                            </el-form-item>
                    </div>
                </el-main>
            </el-form>
            <el-dialog :visible.sync="feedbackContent" :title="$t('SetPasswordHelpVC_title')">
                        <el-form >
                            <el-form-item>
                                <el-input type="textarea" :placeholder="$t('forgetSecurityQuestion')"  maxlength="225" show-word-limit resize="none" rows="8"  v-model="content"></el-input>
                                <el-button  type="primary" style="float:right;margin-top:25px" :disabled='!content' :loading="loading" @click.native.prevent="feedbackSecurite">
                                    {{$t('submit')}}
                                </el-button>
                            </el-form-item>
                        </el-form>
            </el-dialog>
    </el-container>
    
</template>

<script>
import fData from '@/app.config';
import {mapGetters} from 'vuex';
import {
    safeGetQuestion,
    safeQueryQuestion,
    safeAddQuestion,
    safeUpdateQuestion,
    accountFeedback
} from '@/services'

export default {
    data() {
        return {
            loading: false,
            sex: 1,
            content:'',
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
        back(){
            this.$emit('childBack', false)
        },
        getUserQus(){
            safeGetQuestion().then(res => {
                if(res && res.success){
                    let qusData = res.data || {};
                    this.qusData = qusData;
                    this.oldQusPro = qusData.question || '';
                    this.$set(this.ruleForm,'oldQus', qusData.question)
                    /* if(this.qusList.length>0){
                        this.oldQusPro = this.qusList[0].id || '';
                        this.$set(this.ruleForm,'oldQus', this.qusList[0].id)
                    } */
                    
                }
            })
        },
        feedBackS(){
            this.feedbackContent=true
            this.content = ''
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
                    this.$message.success(res.message)
                }else{
                    this.$message.error(res.message)
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

        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.qusData.id){
                        let post = {
                            oldQuestionId: this.qusData.id,
                            oldAnswer: this.ruleForm.oldAns,
                            newQuestionId: this.ruleForm.newQus,
                            newAnswer: this.ruleForm.newAns,
                        }
                        safeUpdateQuestion(post).then(res => {
                            if(res.success){
                                this.resetForm(formName)
                                this.$message.success(this.$t('doSucc'))
                                this.getUserQus()
                                this.$emit('childBack', false)
                            }else{
                                this.$message.error(res.message)
                            }
                        })
                    }else{
                        let post = {
                            questionId: this.ruleForm.newQus,
                            answer: this.ruleForm.newAns
                        }
                        safeAddQuestion(post).then(res => {
                            if(res.success){
                                this.$message.success(this.$t('doSucc'))
                                this.$set(this.ruleForm,'oldQus',this.ruleForm.newQus)
                                this.resetForm(formName)
                                this.$emit('childBack', false)
                            }else{
                                this.$message.error(res.message)
                            }
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
            this.ruleForm = {
                newQus: this.qusList[0].id,
                newAns: '',
                oldQus: this.qusList[0].id,
                oldAns: '',
            }
        }
    },
}
</script>

<style lang='scss' scoped>
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
        .el-select{
                width: 100%;
            }
            .update-box {
    position: relative;
    width: 550px;
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
    .no-margin{
        margin-bottom: 0!important;
    }
    .new-pass {
    background: #fff;
    border-radius: 15px;
        .el-input__inner {
            border-radius: 10px;
        }
        .el-form-item.no-margin {
            position: relative;
            &:before {content: '';width: calc(100% - 15px);border-bottom: 1px solid #E0E3E5;position: absolute;bottom: 2px;left: 15px;z-index: 1;}
        }
    }
</style>