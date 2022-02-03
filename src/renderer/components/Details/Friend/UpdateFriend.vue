<template>
    <div class="update-info-cent" v-if="info">
        <!-- group Name -->
        <div class="update-cent-item" @click="editGroupNameFunc">
            <div class="update-item-title">
                <span>{{$t('nikeName')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.avatar}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <el-dialog
            :title="$t('nikeName')"
            :visible.sync="editGroupName"
            width="30%"
            class="add-series"
        >
            <div class="update-item-title chat-name">
                <input type="text" v-model="groupName"  :placeholder="$t('Choose Name')" @keyup.enter="updateFriend">
                <el-button type="primary" @click="updateFriend">{{$t('submit')}}</el-button>
            </div>
        </el-dialog>

        <div class="update-cent-item" v-if="forbidAddFriends !=1">
            <div class="update-item-title">
                <span>{{$t('account')}}</span>
            </div>
            <div class="update-item-cent" v-clipboard:copy="info.uid" v-clipboard:success="copy" v-clipboard:error="onError" :title="$t('copy')">
                <span>{{info.account}}</span>
            </div>
        </div>
        <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('signature')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.sign}}</span>
            </div>
        </div>
        <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('gender')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.sex | filterSexStatus}}</span>
            </div>
        </div>

        <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('birthday')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.birthday}}</span>
            </div>
        </div>

        <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('area')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.address}} </span>
            </div>
        </div>
        <div class="update-cent-item" v-if="forbidAddFriends !=1">
            <div class="update-item-title">
                <span>{{$t('mailbox')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.email}} </span>
            </div>
        </div>
        
        
       <!--  <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('Search Content')}}</span>
            </div>
            <div class="update-item-cent">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div> -->




    </div>
</template>
<script>
const configs = require('@/configs.js');
import QRCode from 'qrcodejs2' 
import { userListDAO } from "@/services/db";

import {
    share,
    setFriendName,
    bannedList,
} from '@/services'

export default {
    props:["info","forbidAddFriends",'isFromGroup'],
    data() {
        return {
            isShowQRCode: false,
            groupName : this.info.name,
            groupHome: this.info.homePage,
            groupRoomNotice: this.info.roomNotice,
            groupTopNotice : this.info.topNotice === 1 ? true : false,
            editGroupName : false,
            editGroupHome : false,
            editGroupRoomNotice : false,
            bannedListView : []
        }
    },
    methods: {
        
        copy(e) {           
            this.$message.success(this.$t('copySucc'))
        },
        onError(e) {
            console.log(e);
        },
        mutedListFunc(){
            this.showBannedList(this.info)
        },
        async showBannedList(info){
            let post = {
                roomId : info.id,
                page : 1,
                pageSize : 10
            }
            await bannedList(post).then(res => {
                this.bannedListView = res.data.data
                this.$store.dispatch('setMutedList',{item:true , data:res.data.data})

            })
        },
        editGroupRoomNoticeFun(){
            if(this.info.groupRole === 3 || this.info.groupRole === 2){
                this.groupRoomNotice = this.info.roomNotice
                this.groupTopNotice = this.info.topNotice === 1 ? true : false
                this.editGroupRoomNotice = true
            }
        },
        editGroupHomeFunc(){
            if(this.info.groupRole === 3 || this.info.groupRole === 2){
                this.groupHome = this.info.homePage
                this.editGroupHome = true
            }
            
        },
        editGroupNameFunc(){
            if(this.info.friendStatus === 2 && !this.isFromGroup){
                this.groupName = this.info.avatar
                this.editGroupName = true
            }
                
        },
        updateFriend(){
            let post = {
                    nikeName: this.groupName,
                    friendId: this.info.id
                }
                setFriendName(post).then(res => {
                    if(res.success){
                        this.$message.success(this.$t('doSucc'))
                        this.updFriendName(post.friendId,this.groupName)
                        this.info.avatar = this.groupName
                        

                    }else{
                        this.$message.error(res.message)
                    }
                })
        },
        async updFriendName(id,name){

            // 更新用户信息
            // Update user information
            let getInstance = userListDAO.getInstance();
            let uInfo = await getInstance.find(id)
            uInfo.nikeName = name;
            this.$store.commit('UPDATE_USERS_OBJ',uInfo)
            this.$store.commit("SET_CHATINFO", uInfo);
            this.$bus.$emit('usersupd')
            this.$bus.$emit('usersupd:msg')
            this.$bus.$emit('usersupd:sess')
            this.editGroupName = false

        },
        showSettingsFunc(){
            this.$emit('showSettingsFunc', true)
        },
         saveQRCode() {
            let _this = this;
            let msg = this.$message.warning(this.$t('imageProcess'))
            html2canvas(document.querySelector("#capture"), {
                useCORS: true,
                logging: true
            }).then(canvas => {
                let imgUrl = canvas.toDataURL("image/png");
                let imgName = "QRCode-" + new Date().getTime();
                // msg.close();
                this.downloadIamge(imgUrl, imgName);

            });
        },
        downloadIamge(imgsrc, name) { //下载图片地址和图片名
            var image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

                var a = document.createElement("a"); // 生成一个a元素
                var event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件

            };
            image.src = imgsrc;
        },
        shares(id,sharetype){
            this.isShowQRCode = true
            let post = {
                id,
                sharetype,
                outtime: this.nextWeek() // 当前时间加7天 // current time plus 7 days
            }
            let url = configs.testUrl +'/'+share(post)
            this.$nextTick(()=>{  
                var qrcode = new QRCode(this.$refs.qrcodeContainer, {  
                    text: url,  
                    width: 200,  
                    height: 200,  
                    colorDark: '#000000',  
                    colorLight: '#ffffff',  
                    correctLevel: QRCode.CorrectLevel.H  
                })  
            })

        },
    },
}
</script>
<style lang="scss" scoped>
.qr-code {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 100%;
        &:before {
            content: '';
            background: rgba(255,255,255,.8);
            width: 100%;
            height: 100vh;
            position: fixed;
        }
        .qr-code-mark {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: transparent;

        }

        .qr-code-cent {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            .qr-code-close {
                position: absolute;
                right: 25px;
                top: 15px;
                font-size: 24px;
                color: #666;
                cursor: pointer;

                &:hover {
                    color: #000;
                }
            }

            #capture {
                width: 300px;
                height: 400px;
                background: #fff;
                box-shadow: 0 0 10px rgba($color: #000000, $alpha: .5);
                border-radius: 10px;
                padding: 20px 30px;
                box-sizing: border-box;

                .qr-code-avatar {
                    position: absolute;
                    left: calc(50% - 20px);
                    top: calc(50% - 20px);
                    background: #fff;
                    border-radius: 50%;
                    height: 50px;
                    width: 50px;
                    display: flex;
                    .el-avatar{
                        margin: auto;
                    }
                    img {
                        vertical-align: middle;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }

                    p {
                        margin: 10px;
                        vertical-align: middle;
                        font-size: 14px;
                        color: #333;
                    }
                    .no-avatar,img {
                        vertical-align: middle;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;

                    }
                    .vname{
                       width: 40px;
                        height: 40px;
                        font-size: 20px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 40px;
                    }
                }

                .qr-code-img {
                    height: 200px;
                    width: 200px;
                    text-align: center;
                    margin: auto;
                    position: relative;
                    margin-top: 40px;
                }

                p {
                    margin-top: 10px;
                    text-align: center;
                    font-size: 14px;
                    color: rgb(37, 27, 27);
                }
            }

        }

        .qr-code-btn {
            position: absolute;
            bottom: 30px;
            width: 100%;
            height: 40px;
            text-align: center;
        }

    }
    .update-info-cent{

        padding: 1px;
        .update-cent-item {
            margin: 10px 15px;
            padding: 10px 0;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:last-child{
                border: none;
            }
            .update-item-title {
                font-size: 14px;
                color: #333;

                i {
                    vertical-align: middle;
                    margin-right: 10px;
                    font-size: 24px;
                }

                span {
                    vertical-align: middle;
                }

                .leave-group{
                    color: red;
                }
                &:hover .leave-group{
                    color: #8d8d91;
                }
            }

            .update-item-cent {
                padding-left: 40px;
                box-sizing: border-box;
                flex: 1;
                text-align: right;
                color: #999DA0;
                font-size: 16px;
                cursor: pointer;
                overflow: hidden;
                word-break: keep-all;
                text-overflow: ellipsis;
                span{
                    font-size: 14px;
                }
                &:hover {
                    color: #333;

                    img {
                        opacity: .9;
                    }
                }

                img {
                    width: 20px;
                    opacity: .6;
                }
            }
        }
    }
    
</style>