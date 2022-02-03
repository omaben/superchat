<template>
    <div class="update-info-cent" v-if="info">
        <!-- group Name -->
       
	
        <div class="update-cent-item" @click="editGroupNameFunc">
            <div class="update-item-title">
                <span>{{$t('group_name')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.avatar}}</span>
                <i class="el-icon-arrow-right"  v-if="info.groupRole === 3 || info.groupRole === 2"></i>
            </div>
        </div>
        <el-dialog
            :title="$t('group_name')"
            :visible.sync="editGroupName"
            width="30%"
            class="add-series"
        >
            <div class="update-item-title chat-name">
                <input type="text" v-model="groupName"  :placeholder="$t('group_name')" @keyup.enter="updateRooms">
                <el-button type="primary" @click="updateRooms">{{$t('submit')}}</el-button>
            </div>
        </el-dialog>

        <!-- group announcement -->
        <div class="update-cent-item" @click="editGroupRoomNoticeFun">
            <div class="update-item-title">
                <span>{{$t('group_announcement_title')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.roomNotice}}</span>
                <i class="el-icon-arrow-right" v-if="info.groupRole === 3 || info.groupRole === 2"></i>
            </div>
        </div>
        <el-dialog
            :title="$t('group_homepage')"
            :visible.sync="editGroupRoomNotice"
            width="30%"
            class="add-series"
        >
            <div class="update-cent-item chat-name border-none">
                    <div class="update-item-title">
                        <span>{{$t('top')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="groupTopNotice"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2">
                        </el-switch>
                    </div>
                </div>
            <div class="update-item-title chat-name">
                <el-input  maxlength="255" type="textarea" :placeholder="$t('group_homepage_title')" v-model="groupRoomNotice" rows="10" @keyup.enter="updateRooms"></el-input>
                
            </div>
            <div class="update-cent-item chat-name">
                    
                    <div class="update-item-cent">
                        <el-button type="primary" @click="updateRooms">{{$t('submit')}}</el-button>
                    </div>
                </div>

        </el-dialog>
       <!--  <div class="update-cent-item">
            <div class="update-item-title">
                <span>{{$t('Search Content')}}</span>
            </div>
            <div class="update-item-cent">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div> -->

        <!-- group home page -->
        <div class="update-cent-item" @click="editGroupHomeFunc">
            <div class="update-item-title">
                <span>{{$t('group_homepage')}}</span>
            </div>
            <div class="update-item-cent">
                <span>{{info.homePage}}</span>
                <i class="el-icon-arrow-right" v-if="info.groupRole === 3 || info.groupRole === 2"></i>
            </div>
        </div>
        <el-dialog
            :title="$t('group_homepage')"
            :visible.sync="editGroupHome"
            width="30%"
            class="add-series"
        >
            <div class="update-item-title chat-name">
                <input type="text" v-model="groupHome"  :placeholder="$t('group_homepage')" @keyup.enter="updateRooms">
                <el-button type="primary" @click="updateRooms">{{$t('submit')}}</el-button>
            </div>
        </el-dialog>

        <!-- share QR code -->
        <div class="update-cent-item" v-if="info.allowShowQrCode===1 || info.groupRole === 3 || info.groupRole === 2" @click="shares((info.id||info.roomId),2)">
            <div class="update-item-title">
                <span>{{$t('scan_qr_code')}}</span>
            </div>
            <div class="update-item-cent">
                <img  :src="require('@/assets/svg/qr-code.svg')" alt="">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <!-- setting group -->
        <div class="update-cent-item" @click="showSettingsFunc" v-if="info.groupRole === 3 || info.groupRole === 2">
            <div class="update-item-title">
                <span>{{$t('group_setting')}}</span>
            </div>
            <div class="update-item-cent">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <!-- banned list -->
        <div class="update-cent-item" v-if="info.groupRole === 3 || info.groupRole === 2" @click="mutedListFunc()">
            <div class="update-item-title">
                <span>{{$t('muted_list')}}</span>
            </div>
            <div class="update-item-cent">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <transition name="el-zoom-in-top">
            <div class="qr-code" v-if="isShowQRCode">
                <div class="qr-code-mark" @click="isShowQRCode = false"></div>

                <div class="qr-code-cent">
                    <div class="qr-code-close" @click="isShowQRCode = false">
                        <i class="el-icon-close"></i>
                    </div>
                    <div id="capture">
                        <p>{{$t('scanQrCode')}}</p>
                        <div class="qr-code-img">
                            <div class="qr-code-avatar">
                                <el-avatar v-if="info.logo" :src="info.logo"></el-avatar>
                                <el-avatar v-else >{{info.avatar && info.avatar.slice(0,2)}}</el-avatar>
                            </div>
                            <div class="qrcode" ref="qrcodeContainer"></div>  
                        </div>
                        
                        
                    </div>
                    <div class="qr-code-btn">
                        <el-button type="primary" @click="saveQRCode">{{$t('saveToLocal')}}</el-button>
                    </div>
                </div>

            </div>
        </transition>
    </div>
</template>
<script>
const configs = require('@/configs.js');
import QRCode from 'qrcodejs2' 
import html2canvas from 'html2canvas';
import {
    updateRoom,
    share,
    bannedList,
} from '@/services'

export default {
    props:["info"],
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
            if(this.info.groupRole === 3 || this.info.groupRole === 2){
                this.groupName = this.info.name
                this.editGroupName = true
            }
        },
        updateRooms(){
            let post = {
                id: this.info.id,
                roomNotice: this.groupRoomNotice,
                homePage:this.groupHome,
                name: this.groupName,
                logo: this.info.logo,
                topNotice: this.groupTopNotice === true ? 1 : 2
            }

            updateRoom(post).then(res => {
                if(res.success){
                    
                    this.$message.success(this.$t('doSucc'))
                    this.$store.dispatch('SetRoomInfo',{roomId: post.id , status:false})
                    
                        .then(()=>{
                            this.editGroupName = false
                            this.editGroupHome = false
                            this.editGroupRoomNotice = false
                        }).catch(err => {
                            this.$message.error(err)
                        });
                    

                }else{
                    this.$message.error(res.message)
                }
            })
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