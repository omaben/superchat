<template>
 <el-container class="profile-info">
            <el-form :model="ruleForm" label-position="top" status-icon :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">

                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('loginPwd')}}</p>
                         <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('Update')}}</el-button>
                        </div> 
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                        <p>{{$t('updPassDesc')}}</p>
                            <p>
                                {{$t('oldPwd')}}
                            </p>
                            <el-form-item prop="oldPass">
                                <el-input type="password" class="input-style" v-model="ruleForm.oldPass" :placeholder="$t('inp_oldPwd')" autocomplete="off" show-password></el-input>
                            </el-form-item>
                            <p>
                            {{$t('newPwd')}}
                            </p>
                            <div class="new-pass">
                                <el-form-item prop="pass" class="no-margin">
                                    <el-input type="password" class="input-style" v-model="ruleForm.pass" :placeholder="$t('inp_newPwd')" autocomplete="off" show-password></el-input>
                                </el-form-item>
                                <el-form-item prop="checkPass">
                                    <el-input type="password" class="input-style" v-model="ruleForm.checkPass" :placeholder="$t('inp_confirmNewPwd')" autocomplete="off" show-password></el-input>
                                </el-form-item>
                            </div>
                        </div>
                </el-main>
            </el-form>
    </el-container>

</template>

<script>
import { updatePassword } from '@/services'

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('p_pwd')));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('againInpPwd')));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error(this.$t('noSamePwd')));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                oldPass: '',
                pass: '',
                checkPass: ''
            },
            rules: {
                oldPass: [{
                    validator: validatePass,
                    trigger: 'blur'
                }],
                pass: [{
                    validator: validatePass,
                    trigger: 'blur'
                }],
                checkPass: [{
                    validator: validatePass2,
                    trigger: 'blur'
                }]
            }
        };
    },
    mounted() {

    },
    methods: {
        back(){
            this.$emit('childBack', false)
        },
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.oldPass != this.ruleForm.pass){
                        let post = {
                            oldPassword: this.ruleForm.oldPass,
                            password: this.ruleForm.pass,
                            confirmPassword: this.ruleForm.checkPass,
                        }
                        updatePassword(post).then(res => {
                            if(res.success){
                                // this.$message.success("修改成功！")
                                this.$message.success(this.$t('doSucc'))
                                this.$bus.$emit('logout')
                            }else{
                                this.$message.error(res.message)
                            }
                        })
                    }
                    else{
                        this.$message.error(this.$t('samePassword'))
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }

    },
}
</script>

<style lang="scss" scoped>
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
