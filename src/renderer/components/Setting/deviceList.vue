<template>
    <el-container class="profile-info" >
            <el-header>
                <div style="position:relative">
                    <div class="backInfo" @click="back">
                        <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                        <span>{{$t('back')}}</span>
                    </div>
                    <p>{{$t('modifyAccount')}}</p>
                </div>
            </el-header>
            <el-main>
                <div class="item-devices" v-if='currentDevice'>   
                    <p>{{$t('current_device')}}</p>
                    <div class="info-box">
                            
                            <div class="info-item" @click="showChange = 1">
                                
                                <div class="info-item-title">
                                    {{currentDevice.deviceName}}
                                </div>
                                <div class="info-item-cent">
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                            
                    </div>
                </div>
                <div class="item-devices" v-if="otherDevices.length>0">
                    <p>{{$t('other_device')}}</p>
                    <div class="info-box" >
                            
                            <div class="info-item"  v-for="(device,index) in otherDevices" :key="index" @click="viewDevice(device)">
                                
                                <div class="info-item-title">
                                    {{device.deviceName}}
                                </div>
                                <div class="info-item-cent">
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                            
                    </div>
                </div>
                <div class="item-devices" v-if="otherDevices.length>0">
                    <el-button class="logout-user" @click="logoutOtherDevice">{{$t('log_out_all_devices')}}</el-button>
                </div>
                <el-dialog :visible.sync="detailDevices" class="devices-detail" center>
                    <div class="tp-header">
                        <img  :src="require('@/assets/svg/android-ico.svg')" alt="">
                        <img  :src="require('@/assets/svg/pc-ico.svg')" alt="">
                        <img  :src="require('@/assets/svg/ios-ico.svg')" alt="">
                    </div>
                    <div class="info-box">
                        <div class="info-item" >
                            <div class="info-item-title">
                               {{$t('device_name')}}
                            </div>
                            <div class="info-item-cent" >
                                {{detailDeviceInfo.deviceName}}
                            </div>
                        </div>
                        <div class="info-item" >
                            <div class="info-item-title">
                               {{$t('device_type')}}
                            </div>
                            <div class="info-item-cent" >
                                {{detailDeviceInfo.deviceVersion}}
                            </div>
                        </div>
                        <div class="info-item" >
                            <div class="info-item-title">
                               {{$t('last_time_login')}}
                            </div>
                            <div class="info-item-cent" >
                                {{ detailDeviceInfo.lastLoginTime * 1000 | filterDate('YYYY-MM-DD HH:mm')}}
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="detailDevices = false">{{$t('cancel')}}</el-button>
                        <el-button  class="confirm-dialog" type="primary" @click="logoutDevice(detailDeviceInfo)">{{$t('logout')}}</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
</template>

<script>
import {
    getAllDevice,
    logoutDevice,
    logoutOtherDevice
} from '@/services'
export default {
    data() {
        
        return {
            currentDevice : {},
            otherDevices : [],
            detailDevices: false,
            detailDeviceInfo : {},
        };
    },
    mounted() {
        this.getAllDevices()
    },
    methods: {
        back(){
                this.$emit('childBack', false)
            },
        viewDevice(item){
            this.detailDeviceInfo = {...item}
            this.detailDevices = true
        },
        async getAllDevices(){
            await getAllDevice().then(res=>{
                if(res.success){
                    console.log(res,'device')
                    this.currentDevice = res.data.find(item => item.isCurrent === 1)
                    this.otherDevices = res.data.filter(item => item.isCurrent === 2)
                }
            })
        },
        async logoutDevice(item){
            let post = {
                id : item.id
            }
            console.log(item,'item')
            this.$confirm(this.$t('isConfirmAction'), 'Device Log Out', {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(async() => {
                
                await logoutDevice(post).then(res=>{
                     if(res.success){
                         this.otherDevices.splice(this.otherDevices.indexOf(item), 1);
                         this.$message.success(res.message)
                         this.detailDevices = false
                     }else{
                         this.$message.error(res.message)
                     }
                })
            }).catch(()=>{})
            
        },
        async logoutOtherDevice(){
           
            this.$confirm(this.$t('isConfirmAction'), 'Device Log Out', {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(async() => {
                
                await logoutOtherDevice().then(res=>{
                     if(res.success){
                         this.otherDevices = []
                         this.$message.success(res.message)
                     }else{
                         this.$message.error(res.message)
                     }
                })
            }).catch(()=>{})
        }
    },
}
</script>

<style lang="scss" scoped>
.item-devices {
    width: 500px;
    margin: 0 auto;
}
.logout-user {
            margin-top: 30px;
            width: 100%;
            border-radius: 20px;
            background: #fff !important;
            border: none;
            color: #FF3939;
            font-size: 16px;
            text-transform: capitalize;
        }

.info-box {
        background: #fff;
        position: relative;
        padding: 0px 0px;
        box-sizing: border-box;
        border-radius: 20px;
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
                width: calc(100% - 25px);
                position: absolute;
                bottom: 0;
                left: 25px;
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
    .item-devices>p {
        width: 500px;
        margin: 15px auto;
        color: #999DA0;
        font-size: 16px;
    }
    .tp-header {
        text-align: center;
        img {
            margin: 10px;
        }
    }
    .confirm-dialog{
        background: #FFB100 !important;
        font-size: 14px;
        color: #fff !important;
        border: none;
    }
</style>
