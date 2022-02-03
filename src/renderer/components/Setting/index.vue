<template>
<div class="settting-box">
    <div class="setting-box-mark"></div>
    <div class="settting-box-cent">
        <div class="settting-close" @click="hideSetBox">
            <i class="el-icon-close"></i>
        </div>
        <div class="setting-box-title">
            <h3>{{$t('setUp')}}</h3>
            <div class="setting-title-item" :class="{'active':activeIdx == 1}" @click="showSet(1)">
                <div class="info-item-icon">
                    <img src="@/assets/userInfo.png" alt="">
                </div>
                <div class="info-item-title">
                    {{$t('pinfos')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 2}" @click="showSet(2)">
                <div class="info-item-icon">
                    <!-- <img src="@/assets/userInfo.png" alt=""> -->
                    <i class="el-icon-key"></i>
                </div>
                <div class="info-item-title">
                    {{$t('loginPwd')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 3}" @click="showSet(3)">
                <div class="info-item-icon">
                    <i class="el-icon-set-up"></i>
                </div>
                <div class="info-item-title">
                    {{$t('secQues')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 7}" @click="showSet(7)">
                <div class="info-item-icon">
                    <i class="el-icon-set-up"></i>
                </div>
                <div class="info-item-title">
                    {{$t('accountSecurity')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 9}" @click="showSet(9)">
                <div class="info-item-icon">
                    <i class="el-icon-set-up"></i>
                </div>
                <div class="info-item-title">
                    {{$t('login_devices')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 8}" @click="showSet(8)">
                <div class="info-item-icon">
                    <i class="el-icon-set-up"></i>
                </div>
                <div class="info-item-title">
                    {{$t('Blacklist')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 4}" @click="showSet(4)">
                <div class="info-item-icon">
                    <img src="@/assets/gx.png" alt="">
                </div>
                <div class="info-item-title">
                    {{$t('checkForUpdates')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 5}" @click="showSet(5)">
                <div class="info-item-icon">
                    <img src="@/assets/yjfk.png" alt="">
                </div>
                <div class="info-item-title">
                    {{$t('feedback')}}
                </div>
            </div>
            <div class="setting-title-item" :class="{'active':activeIdx == 6}" @click="showSet(6)">
                <div class="info-item-icon">
                    <i class="el-icon-set-up"></i>
                </div>
                <div class="info-item-title">
                    {{$t('language')}}
                </div>
            </div>
        </div>
        <div class="setting-box-content">
            <user-info v-if="activeIdx == 1"></user-info>
            <update-pass v-if="activeIdx == 2"></update-pass>
            <safe-pass v-if="activeIdx == 3"></safe-pass>
            <account-security v-if="activeIdx == 7"></account-security>
            <update-box v-if="activeIdx == 4"></update-box>
            <feed-back v-if="activeIdx == 5"></feed-back>
            <language v-if="activeIdx == 6"></language>
            <black-list v-if="activeIdx == 8"></black-list>
            <device-list v-if="activeIdx == 9"></device-list>

        </div>
    </div>

</div>
</template>

<script>
import UserInfo from "./userInfo";
import UpdateBox from "./update";
import FeedBack from "./feedback";
import UpdatePass from "./UpdatePass";
import safePass from "./safePass";
import language from "./language";
import blackList from "./blackList";
import deviceList from "./deviceList";
import accountSecurity from "./accountSecurity";
export default {
    components: {
        UpdateBox,
        FeedBack,
        UserInfo,
        UpdatePass,
        safePass,
        language,
        blackList,
        accountSecurity,
        deviceList
    },
    props: ['menu'],
    data() {
        return {
            activeIdx: 1

        }
    },
    mounted() {
        this.activeIdx = this.menu;
        this.showSet(this.menu);

    },
    methods: {
        showSet(type) {
            this.activeIdx = type;

        },
        hideSetBox() {
            this.$emit('hideSetBox', true);
        }
    },
}
</script>

<style lang="scss" scoped>
.settting-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;

    .settting-box-mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: transparent;
    }

    .settting-box-cent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 650px;
        height: 650px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba($color: #000000, $alpha: .5s);
        display: flex;

        .settting-close {
            position: absolute;
            left: 10px;
            top: 10px;
            font-size: 24px;
            color: #000;
            cursor: pointer;

            &:hover {
                color: #ccc;
            }
        }

        .setting-box-title {
            padding-top: 50px;
            box-sizing: border-box;
            width: 250px;
            height: 100%;
            background: #f1f1f4;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;

            h3 {
                margin-bottom: 20px;
                font-size: 26px;
                padding-left: 20px;
                box-sizing: border-box;
            }

            .setting-title-item {
                padding: 20px;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                display: flex;
                align-items: center;
                cursor: pointer;

                &:hover {
                    color: #999;
                }

                .info-item-icon {
                    margin-right: 10px;

                    img {
                        width: 20px;
                    }

                    i {
                        font-size: 20px;
                    }
                }

                .info-item-title {
                    font-size: 16px;
                }

                &.active {
                    background: #fff;
                }
            }

        }

        .setting-box-content {
            flex: 1;
        }
    }
}
</style>
