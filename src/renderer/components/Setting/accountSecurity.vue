<template>
    <div>
         <el-container class="profile-info" v-show="!showChange">
            <el-header>
                <div style="position:relative">
                    <div class="backInfo" @click="back">
                        <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                        <span>{{$t('back')}}</span>
                            
                    </div>
                    <p>{{$t('accountSecurity')}}</p>
                </div>
            </el-header>
            <el-main>
                <div class="info-box">
                    <div>
                        <div class="info-item" @click="showChange = 1">
                            
                            <div class="info-item-title">
                                {{$t('modifyAccount')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="info-item" @click="showChange = 2">
                            
                            <div class="info-item-title">
                                {{$t('whoCanWatch')}}
                            </div>
                            <div class="info-item-cent">
                                 <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
        <div v-if="showChange">
            <modify-account v-if="showChange == 1" @childBack="nameBack"></modify-account>
            <visible-account v-if="showChange == 2" @childBack="nameBack"></visible-account>
        </div>
    </div>
    
</template>
<script>
    import {mapGetters} from 'vuex';
    import modifyAccount from "./modifyAccount/index";
    import visibleAccount from "./visibleAccount";
    import {modifyUser} from '@/services'
    export default {

        components: {
            modifyAccount,
            visibleAccount
        },
        data() {
            return {
                showChange: false,
                
            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mounted() {
            


        },
        methods: {
            back(){
                this.$emit('childBack', false)
            },
            // 个人资料修改
            nameBack(boolean,val) {
                this.showChange = false;
            },

            

        },
    }
</script>

<style lang="scss" scoped>
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
    </style>