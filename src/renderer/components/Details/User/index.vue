<template>
    <div class="userInfo" v-if="showUserInfo">
        <div class="sidebar-container">
            <el-container class="profile-info">
                <el-header>
                    <div @click="funShowInfoBoxNew">
                        <p>{{$t('me_menu_title')}}</p>
                        <img  :src="require('@/assets/svg/back.svg')" alt="" >
                    </div>
                </el-header>
                <el-main>
                    <update-avatar :info="userInfo"></update-avatar>
                    <choose-file
                        ref="chooseFile"
                        v-show="chooseFile"
                        
                    />
                    <el-row class="tac">
                        <el-menu
                            default-active="7"
                            class="el-menu-vertical-demo">
                            <el-menu-item index="1" disabled>
                                <span class="title">{{$t('nikeName')}} </span>
                                <br/>
                                <span class="info">{{userInfo.nikeName}}</span>
                            </el-menu-item>
                            <el-menu-item index="2" disabled>
                                <span class="title">{{$t('signature')}}</span>
                                <br/>
                                <span class="info">{{userInfo.sign}}</span>
                            </el-menu-item>
                            <el-menu-item index="7" v-if='showWallet'  @click="showInfoUser = 1">
                                <img  :src="require('@/assets/svg/wallet.svg')" alt="" >
                                <span>{{$t('wallet')}} <i class="el-icon-arrow-right"></i></span>
                            </el-menu-item>
                            <el-menu-item index="3" @click="showInfoUser = 2">
                                <img  :src="require('@/assets/svg/personal-info.svg')" alt="" >
                                <span>{{$t('pinfos')}} <i class="el-icon-arrow-right"></i></span>
                            </el-menu-item>
                            <el-menu-item index="4" @click="showInfoUser = 3">
                                <img  :src="require('@/assets/svg/settings.svg')" alt="" >
                                <span>{{$t('setUp')}} <i class="el-icon-arrow-right"></i></span>
                            </el-menu-item>
                            <el-menu-item index="5" @click="updateVersion = true">
                                <img  :src="require('@/assets/svg/update.svg')" alt="" >
                                <span>{{$t('checkForUpdates')}}</span>
                            </el-menu-item>
                            <el-menu-item index="6" @click="clearStorage()">
                                <img  :src="require('@/assets/svg/clear-cache.svg')" alt="" >
                                <span>{{$t('clearLocalCache')}}</span>
                            </el-menu-item>
                        </el-menu>
                        <el-button class="logout-user" @click="logOut">{{$t('logout')}}</el-button>
                    </el-row>
                </el-main>
                <el-dialog  :visible.sync="updateVersion"  :modal="false" class="update-version">
                    <update-box></update-box>
                </el-dialog>
            </el-container>
        </div>
        <div class="main-container">
            <wallet v-if="showInfoUser === 1 && appConfig && appConfig.paymentSet===1"/>
            <user-info v-if="showInfoUser === 2" />
            <setting v-if="showInfoUser === 3"/>
        </div>
    </div>
    
</template>
<script>
import {  mapGetters } from 'vuex'
import UpdateBox from "@/components/Setting/update";
import UserInfo from "@/components/Setting/userInfo";
import UpdateAvatar from "@/components/Setting/updateAvatar";
import Setting from "./Setting";
import ChooseFile from "@/components/Chat/components/ChooseFile";
import Wallet from './wallet.vue';

export default {
    props:['showUserInfo'],
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
    components: {
        UpdateBox,
        UserInfo,
        Setting,
        UpdateAvatar,
        ChooseFile,
        Wallet
    },
   
    data() {
        return {
            appConfig: '',
            chooseFile: false,
            showInfoUser: 1,
            updateVersion : false,
            showWallet: false,
            
        }
    },
    methods: {
        avatarBack(boolean,val) {
            if(boolean){
                console.log('test')
                this.$set(this.userInfo,"photo",val)
            }
            
        },
        upAvatar(){
               this.$bus.$emit('upAvatar')
        },
        funShowInfoBoxNew(){
            this.showInfoUser = 1
            this.$bus.$emit('show_user_info',false);
        },
        errorHandler() {
            return true
        },
        logOut(){
            this.$store.dispatch('LogOut').then(() => {
                this.$router.push('/loginPhone').catch(()=>{})
                this.ipcRenderer.send('logout')
                this.closeWS()
            }).catch(err=>{
                console.log('logout_err: ',err)
            })
        },
        clearStorage(){
            // this.userStore.clear()
            this.$confirm(this.$t('confirmClearStorage'), this.$t('clearLocalCache'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.clearLocalStorage()
                // 清除electron-store缓存
                for(let key in this.userStore.store){
                    if(key.indexOf('RC_')>-1){
                        let mineId = this.userInfo.id
                        let keyMine = 'RC_'+mineId
                        if(key!=keyMine){
                            console.log("key: ", key)
                            this.userStore.delete(key)
                            console.log('user_store: ', this.userStore.store)
                        }
                    }
                }

                this.$message.success(this.$t('doSucc'))
                this.ipcRenderer.send('reload')
                //window.ws.reload()

            }).catch(()=>{})
        }
    },
    mounted() {
        this.$bus.$off('logout')
        this.$bus.$on('logout',() => {
            this.logOut()
        })
        this.appConfig = JSON.parse(sessionStorage.getItem("appConfig"))
        this.showInfoUser = this.appConfig && this.appConfig.paymentSet===1? 1 : 2
        this.showWallet = this.appConfig && this.appConfig.paymentSet===1? true : false
    },
}
</script>
<style lang="scss" scoped>
    .profile-info{
        font-size: 14px;
        .el-header{
            background: var(--primary-color);
            color: #fff;
            text-align: center;
            line-height: 60px;
            text-transform: capitalize;
            font-size: 18px;
            cursor: pointer;
            img{
                position: absolute;
                left: 10px;
                top: 23px;
            }
        }
        .el-main{
            padding: 0;
            .avatar-user-iinfo {
                padding: 20px;
                text-align: center;
                cursor: pointer;
                span{
                    font-size: 24px;
                }
            }
            .el-menu-item{
                text-transform: capitalize;
                &:focus,&:hover,&.is-active{
                    background: #F0F3F4;
                    color: var(--primary-color);
                }
                img{
                    margin-right: 10px;
                }
                span {
                    vertical-align: initial;
                    i{
                        float: right;
                        position: relative;
                        top: 20px;
                        right: -20px;
                    }
                    &.title {
                        font-size: 12px;
                        color: var(--primary-color);
                    }
                    &.info {
                        font-size: 15px;
                        color: #000;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: block;
                    }
                }
                &:before {
                    content: '';
                    position: absolute;
                    width: calc(100% - 55px);
                    left: 55px;
                    border-bottom: 1px solid #E0E3E5;
                    bottom: 0;
                }
                &.is-disabled{
                    opacity: 1;
                    cursor: initial;
                    line-height: initial;
                    padding-top: 9px;
                    &:before {
                        left: 23px;
                        width: calc(100% - 20px);
                    }
                }
            }
        }
        .logout-user {
            margin-top: 15px;
            width: 100%;
            border-radius: 0;
            border: none;
            color: #FD6E22;
            font-size: 16px;
            text-transform: capitalize;
        }
    }
    .update-version .el-dialog__header{
        border: none;
    }
    .userInfo {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background: #fff;
        z-index: 2000;
        left: 0;
        .sidebar-container{
            background: #F0F3F4 !important;
        }
    }
</style>