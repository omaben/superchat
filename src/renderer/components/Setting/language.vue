<template>
    <el-container class="profile-info">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('language')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="changeLang(lang)">{{$t('Update')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('langSetting')}}:
                            </p>
                            <div class="update-input">
                                <ul>
                                    <li v-for="item in rootConfig.langArr" :key="item.value" :class="{'select' : item.value=== lang}" @click="updateLang(item.value)">
                                         <img  :src="require('@/assets/svg/checked-gender.svg')" alt="">
                                        {{item.key}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        let getLang = () => {
            let userInfo = this.getUserStore('userCommon');
            let lang;
            if(userInfo){
                const isObject = (obj) => {
                    return Object.prototype.toString.call(obj) === "[object Object]";
                }
                const hasKey = (obj,key) => {
                    return isObject(obj)?obj.hasOwnProperty(key):false
                }
                if(hasKey(userInfo,"id")){
                    let id = userInfo.id
                    lang = this.getChatLocalMsgStore('Language',id+'')
                }
            }
            return lang || 'zh'
        }
        return {
            lang: getLang(),
        };
    },
    methods: {
        updateLang(lang){
            this.lang = lang
        },
        back(){
            this.$emit('childBack', false)
        },
        changeLang(data){

            sessionStorage.setItem('local', data)
            
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || ''
            this.ipcRenderer.send("changeLang", data, userInfo);
        }
    },
}
</script>

<style lang="scss" scoped>
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
        border-radius: 5px;
        ul {
            background: #fff;
            padding: 15px;
            border-radius: 9px;
            border: none;
            li {
                padding: 15px 0;
                border-bottom: 1px solid #E0E3E5;
                cursor: pointer;
                &:last-child {
                    border: none;
                    padding-bottom: 0;
                }
                &:first-child {
                    padding-top: 0;
                }
                &.select{
                    img{
                        opacity: 1;
                    }
                }
                img{
                    float: right;
                    opacity: 0;
                }
            }

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
</style>
