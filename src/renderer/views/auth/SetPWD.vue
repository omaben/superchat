<template>
<div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="title">
            <img src="@/assets/icon_zhuce_top.png" alt="">
            <h3>
                {{$t('resetPwd')}}
            </h3>
            <h5>{{$t('setNewPwd')}}</h5>
        </div>

        <el-form-item prop="password">
            <el-input :type="pwdType" v-model="loginForm.password" autocomplete="off" :placeholder="$t('pwd_str')"></el-input>
            <img class="show-pwd" v-show="!pwdType" @click="pwdType = 'password'" src="@/assets/icon_eye_xs.png" alt="">
            <img class="show-pwd" v-show="pwdType" @click="pwdType = ''" src="@/assets/icon_eye_yc.png" alt="">
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input name="checkPass" :type="checkPwdType" v-model="loginForm.checkPass" autoComplete="on" :placeholder="$t('confirmPwd')"></el-input>
            <img class="show-pwd" v-show="!checkPwdType" @click="checkPwdType = 'password'" src="@/assets/icon_eye_xs.png" alt="">
            <img class="show-pwd" v-show="checkPwdType" @click="checkPwdType = ''" src="@/assets/icon_eye_yc.png" alt="">
        </el-form-item>
        <div class="pwd-style"></div>
        <el-form-item>
            <el-button class="sure" type="primary" style="width:100%;" :disabled="!loginForm.password || !loginForm.checkPass" :loading="loading" @click.native.prevent="handleLogin">
                {{$t('reset')}}
            </el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" plain style="width:100%;" @click="toPath(-1)">
                {{$t('prev')}}
            </el-button>
        </el-form-item>

    </el-form>
</div>
</template>

<script>
import { actUpdPass } from '@/services'
import fData from '@/app.config';

export default {
    name: 'login',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('p_pwd')));
            } else if (!fData.pwdReg.test(value)) {
				callback(new Error(this.$t('pwd_str')));
			} else {
                if (this.loginForm.checkPass !== '') {
                    this.$refs.loginForm.validateField('checkPass');
                }
                callback();
            }
        };
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('inpPwdAgain')));
            } else if (value !== this.loginForm.password) {
                callback(new Error(this.$t('pwdNotEqual')));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                password: '',
                checkPass: ''
            },
            loginRules: {
                password: [{
                    validator: validatePass,
                    trigger: 'blur'
                }],
                checkPass: [{
                    validator: validatePass2,
                    trigger: 'blur'
                }],
            },
            loading: false,
            pwdType: 'password',
            checkPwdType: 'password',
            query: this.$route.query
        }
    },
    mounted() {

    },
    methods: {
        
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    let post = {
                        areaCode: this.query.areaCode,
                        phone: this.query.phone,
                        password: this.loginForm.password,
                        confirmPassword: this.loginForm.checkPass,
                    }
                    this.loading = true
                    actUpdPass(post).then(res => {
                        if(res.success){
                            this.$message.success(this.$t('doSucc'))
                            let key = this.query.areaCode + this.query.phone
                            this.removeLocalStorage(key)
                            this.toPath("loginPhone")
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
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #fff;
    user-select: none;

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 275px;
        margin: 0 auto;
    }

    .title {
        margin-top: 50px;

        img {
            width: 90px;
        }

        h3 {
            font-size: 24px;
            letter-spacing: 0px;
            color: #1ab2ff;
            font-weight: bold;

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
        height: 47px;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 0;
            color: #333;
            height: 47px;

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
    }

    .to-registered {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #999999;

        span {
            color: #1ab2ff;
            position: relative;
            cursor: pointer;

            &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 1px;
                background: #1ab2ff;
            }
        }
    }

}

.is-disabled {
    opacity: 0.4;
}

.sure {
    background-color: #1ab2ff;
    border-color: #1ab2ff;
    box-shadow: 0px 3px 12px 0px rgba(26, 178, 255, 0.3);
}
/deep/.el-input {
    .el-input__inner{
        height: 47px;
        color: #666;
    }
}
</style>
