<template>
    <div>
         <el-container class="profile-info" v-show="!showChange">
            <el-header>
                <div>
                    <p>{{$t('pinfos')}}</p>
                    <div class="add-member-btn">
                        <el-button type="primary" @click="updInfo()">{{$t('Update')}}</el-button>
                    </div>
                </div>
            </el-header>
            <el-main>
                <div class="info-box">
                    <div>
                        <div class="info-item" @click="showChange = 2">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/account-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('nikeName')}}
                            </div>
                            <div class="info-item-cent">
                                {{infoPro.nikeName}}
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/id-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('account')}}
                            </div>
                            <div class="info-item-cent" v-clipboard:copy="infoPro.uid" v-clipboard:success="copy" v-clipboard:error="onError" :title="$t('copy')"> 
                                {{infoPro.account}}
                            </div>
                        </div>
                        
                        <div class="info-item" @click="shares((infoPro.id),1)">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/QR-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('scan_qr_code')}}
                            </div>
                            <div class="info-item-cent">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 3">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/signature-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('signature')}}
                            </div>
                            <div class="info-item-cent" >
                                {{infoPro.sign}}
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 4">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/gender-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('gender')}}
                            </div>
                            <div class="info-item-cent">
                                {{infoPro.sex | filterSexStatus}}
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 5">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/birthday-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('birthday')}}
                            </div>
                            <div class="info-item-cent">
                                {{infoPro.birthday}}
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 6">
                            <div class="info-item-icon">
                               <img  :src="require('@/assets/svg/map-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('area')}}
                            </div>
                            <div class="info-item-cent">
                                {{infoPro.address}}
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 7">
                            <div class="info-item-icon">
                                <img  :src="require('@/assets/svg/email-user.svg')" alt="">
                            </div>
                            <div class="info-item-title">
                                {{$t('mailbox')}}
                            </div>
                            <div class="info-item-cent">
                               {{infoPro.email}}
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </el-main>
        </el-container>
        <div v-if="showChange">
            <update-avatar v-if="showChange == 1" :info="infoPro" @childBack="avatarBack"></update-avatar>
            <update-name v-if="showChange == 2" :info="infoPro" @childBack="nameBack"></update-name>
            <update-signature v-if="showChange == 3" :info="infoPro" @childBack="signBack"></update-signature>
            <update-gender v-if="showChange == 4" :info="infoPro" @childBack="genderBack"></update-gender>
            <update-birthday v-if="showChange == 5" :info="infoPro" @childBack="birthdayBack"></update-birthday>
            <update-address v-if="showChange == 6" :info="infoPro" @childBack="addressBack"></update-address>
            <update-email v-if="showChange == 7" :info="infoPro" @childBack="mailBack"></update-email>
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
                                <el-avatar v-if="infoPro.photo" :src="infoPro.photo"></el-avatar>
                                <el-avatar v-else >{{infoPro.nikeName && infoPro.nikeName.slice(0,2)}}</el-avatar>
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
    import updateAvatar from './updateAvatar';
    import updateName from './updateName';
    import updateSignature from './updateSignature';
    import updateGender from './updateGender';
    import updateBirthday from './updateBirthday';
    import updateAddress from './updateAddress';
    import updateEmail from './updateEmail';
    
    import {mapGetters} from 'vuex';
    import {share,modifyUser} from '@/services'
    export default {

        components: {
            updateAvatar,
            updateName,
            updateSignature,
            updateGender,
            updateBirthday,
            updateAddress,
            updateEmail
        },
        data() {
            return {
                showChange: false,
                infoPro: {},
                isShowQRCode : false,
                pickerOptions: {
          			disabledDate(time) {
          	 			return time.getTime() > Date.now();
          			}
        		}, 


            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mounted() {
            this.infoPro = {
                ...this.userInfo
            }


        },
        methods: {
            copy(e) {           
                this.$message.success(this.$t('copySucc'))
            },
            onError(e) {
                console.log(e);
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
            dateChage(val) {
                this.$set(this.infoPro,"birthday",val)
            },
            validateEmail(email) {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            // 个人资料修改
            updInfo() {
                if (this.validateEmail(this.infoPro.email) || this.infoPro.email === ''){
                
                modifyUser(this.infoPro).then(res => {
                    if (res.success) {
                        this.$store.commit('SET_USERINFO', this.infoPro) //同步更新个人资料
                        // this.$message.success("修改成功！")
                        this.$message.success(this.$t('doSucc'))
                    } else {
                        this.infoPro = {...this.userInfo}
                        this.$message.error(res.message)
                    }
                })
                }else{
                    this.$message.error(this.$t('invalidMail'))
                    return
                }
            },

            avatarBack(boolean,val) {
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"photo",val)
                }
            },
            nameBack(boolean,val) {
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"nikeName",val)
                }
            },
            signBack(boolean,val){
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"sign",val)
                }
            },
            genderBack(boolean,val){
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"sex",val)
                }
            },
            birthdayBack(boolean,val){
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"birthday",val)
                }
            },
            addressBack(boolean,val){
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"address",val)
                }
            },
            mailBack(boolean,val){
                this.showChange = false;
                if(boolean){
                    this.$set(this.infoPro,"email",val)
                }
            },
            
            

        },
    }
</script>

<style lang="scss" scoped>
    .placear{
        width: auto!important;
    }
    .info-box {
        background: #fff;
        position: relative;
        padding: 0px 0px;
        box-sizing: border-box;
        border-radius: 5px;
        overflow-y: scroll;
        width: 500px;
        margin: 0 auto;

        h6 {
            margin-bottom: 20px;
            font-size: 12px;
            color: #999;
        }

        .info-item {
            padding: 16px 15px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
            &::before{
                content: '';
                width: calc(100% - 45px);
                position: absolute;
                bottom: 0;
                left: 45px;
                border-bottom: 1px solid #E0E3E5;
            }
            .info-item-icon {
                img {
                    width: 14px;
                }

                i {
                    font-size: 25px;
                }
            }

            .info-item-title {
                margin-left: 10px;
                font-size: 14px;
                color: #333;
            }

            .info-item-cent {
                flex: 1;
                text-align: right;
                font-size: 14px;
                color: #999;
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
            img{
                position: absolute;
                left: 10px;
                top: 23px;
            }
        }
        .el-main{
            background: #F0F3F4 !important;
            height: calc(100vh - 60px);
            padding-top: 80px;
        }
        .add-member-btn {
            position: absolute;
            right: 0;
            top: 0;
            button{
                        background: transparent;
                        border: transparent;
                        font-size: 16px;
                        color: var(--primary-color);
                        font-weight: 100;
                        font-family: "rubik" !important;
                        &.is-disabled{
                            color: #D3D5D6;
                        }
            }
        }
    }
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
</style>