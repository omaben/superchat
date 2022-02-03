<template>
<div>
    <el-container class="profile-info" v-show="!showChange">
            <el-header>
                <div style="position:relative">
                    <div class="backInfo" @click="back">
                        <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                        <span>{{$t('back')}}</span>
                    </div>
                    <p>{{$t('whoCanWatch')}}</p>
                </div>
            </el-header>
            <el-main>
                <div class="update-box">
                     <el-form >
                            <div class="update-input">
                                <el-form-item>
                                    <el-radio-group v-model="visible" class="visible-account" @change="setVisible">
                                        <el-radio label="1"><span class="title">{{$t('public')}}</span><br/><span class="desc">{{$t('publicDesc')}}</span></el-radio>
                                        <el-radio label="2"><span class="title">{{$t('private')}}</span><br/><span class="desc">{{$t('privateDesc')}}</span></el-radio>
                                        <el-radio label="3" ><span class="title" @click="setVisible">{{$t('Section')}}</span><br/><span class="desc"  @click="setVisible">{{$t('sectionDesc')}}</span></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                
                            </div>
                     </el-form>
                     <ul class="list-section" v-show="listSection.length>0">
                        <li v-for="(item,idx) in listSection" 
                            :key="idx" 
                            >
                            <div class="chat-avatar" v-if="idx<5">
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                            </div>
                            <div class="chat-avatar" v-if="idx>4">
                                <p>+</p>
                            </div>
                        </li>
                    </ul>
                </div>
                
            </el-main>
            
        </el-container>
        <div v-if="showChange">
                <section-visible v-if="showChange" @childBack="nameBack"></section-visible>
            </div>
</div>
    
        
</template>

<script>

import {
    mapGetters
} from 'vuex'
import {accountSetShow,getAccountShow} from '@/services'
import sectionVisible from "./sectionVisible";

export default {
    
    components: {
            sectionVisible,
    },
    data() {
        return {
            listSection:[],
            visible:0,
            showChange:false
        }
    },
     ...mapGetters([
             'friends',
            'chatInfo',
            'usersObj'
        ]),
    mounted() {
        this.AccountShow()
    },
    methods: {
        AccountShow(){
            getAccountShow().then(res =>{
                if(res.success){
                    console.log(res.data,'res.data')
                    this.visible=res.data.isShow.toString()
                    if(res.data.showUsers){
                        this.listSection=[...res.data.showUsers]
                    }
                }
            })
        },
        nameBack(boolean,val) {
                this.showChange = false;
                this.AccountShow()
        },
        back() {
            this.$emit('childBack', false)
        },
        makeUserMsg(item,status){
            let idf = this.getRoomIdsId(item.roomIdAndId)
            let pickObj = this.usersObj[idf];
            let val
            if(pickObj){
                if(status==1){
                    val = pickObj.photo
                }else if(status==2){
                    val = pickObj.nikeName
                }
            }
            return val || ''
        },
        setVisible(){
            if(this.visible=='3'){
                this.showChange=true
                return
            }
            let post = {
                isShow: parseInt(this.visible),
            }
            accountSetShow(post).then(res => {
                if(res.success){
                    if(this.visible=='1'){
                        this.listSection = []
                        this.$message.success('Your profile is public')      
                    }
                    else if (this.visible=='2'){
                        this.listSection = []
                        this.$message.success('Your profile is private')      
                    }
                }else{
                    this.$message.error(res.message)
                }
            })
            
        }
    },
}
</script>

<style lang="scss" scoped>
.update-box {
    background: #fff;
    position: relative;
    border-radius: 10px;

    h5 {
        font-size: 16px;
        color: #333;
        cursor: pointer;
        margin-bottom: 30px;

        i {
            vertical-align: middle;
            margin-right: 10px;
            font-size: 20px;
        }
    }
    .el-radio-group.visible-account {
        label {
            width: 100%;
            margin: 16px 10px;
            .title{
                font-weight: bold;
                color: black;
            }
            .desc{
                padding-left: 23px;
            }
        }
    }
    
    p {
        margin: 50px 0;
        font-size: 12px;
        color: #666;
    }

    .avatar {
        margin: 0 auto;
        width: 150px;
        height: 150px;
        border-radius: 50%;

        .no-avatar,img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            font-size: 50px;
            color: #333;
            background: #f1f1f4;
            text-align: center;
            line-height: 150px;
            cursor: pointer;
        }
    }
    .sub-btn {
        margin-top: 20px;
        text-align: center;
        button {
            width: 120px;
        }
    }

}
ul.list-section {
    height: 45px!important;
    position: relative;
    top: -27px;
    left: 24px;
}
i.icon-select {
    font-size: 17pt;
    color: green;
}
.el-icon-circle-close.icon-select {
    color: red;
}
ul.list-section li {
    display: inline-block!important;
    padding-top: 0px!important;
    &:hover{
        background:transparent!important;
    }
}
ul.list-section {
    display: flex;
    li {
                // height: 1000px;
                display: flex;
                align-items: center;
                padding: 15px 10px;
                box-sizing: border-box;

                &.active {
                    background: #ceecfa !important;
                }

                &:hover {
                    cursor: pointer;
                    background: #dff1fa;
                }

                .chat-avatar {
                    width: 35px;
                    height: 35px;
                    .el-avatar {
                        
                        &.with-status:before{
                                    content: '';
                                    position: absolute;
                                    right: 0;
                                    bottom: 0;
                                    width: 16px;
                                    height: 16px;
                                    border: 3px solid #f0f0f0;
                                    background: var(--primary-color);
                                    border-radius: 50%;
                        }
                                position: relative;
                                overflow: inherit;
                               
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }

                    p {
                        border-radius: 50%;
                        width: 35px;
                        height: 35px;
                        font-size: 12px;
                        color: var(--primary-color);
                        background: #e5e4e8;
                        font-weight: bold;
                        text-align: center;
                        line-height: 35px;
                        margin: 0;
                    }
                }

                .chat-desc {
                    margin-left: 10px;
                    flex: 1;
                    align-items: center;

                    h6 {
                        font-size: 14px;
                        color: #2b2c33;
                        font-weight: 500;

                    }

                    p {
                        margin-top: 5px;
                        font-size: 14px;
                        color: #999;
                        overflow: hidden;
                        width: 240px;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        margin: 0;
                    }
                }

            }
}
.sub-btn {
        margin-top: 20px;

        button {
            width: 120px;
            float: right;
        }
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
