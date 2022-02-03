<template>
    <div class="update-info-cent">
        <div v-if="!transferOwnerGroup">
            <div class="update-cent-item">
                    <div class="update-item-title">
                       <!--  <i class="el-icon-collection-tag"></i> -->
                        <span>{{$t('forbid_adding_friend')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.forbidAddFriends"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('hide_group_member_list')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.hideMemberList"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('allow_members_to_invite')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.allowInvite"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('allow_members_to_view_qr')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.allowShowQrCode"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('group_review')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.groupReview"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('remove_notification')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.showRoomNotice"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                <!-- <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('mute_notification')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.showMuteNotice"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div> -->
                <div class="update-cent-item">
                    <div class="update-item-title">
                        <span>{{$t('forbid_group_member_to_leave')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <el-switch
                            v-model="settingGroup.forbidLeave"
                            active-color="#13ce66"
                            inactive-color="#F2F2F2"
                            @change="updateSettings"
                            >
                        </el-switch>
                    </div>
                </div>
                
                <div class="update-cent-item" v-if="info.groupRole === 3 && info.members.length > 1" @click="openOwnerTransfer()" >
                    <div class="update-item-title">
                        <span>{{$t('group_owner_transfer')}}</span>
                    </div>
                    <div class="update-item-cent">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
        </div>
        <div class="add-group-members" v-else>
            <choose-owner :oldSelectMemberList='selectMemberList' @selectItem='ownerTransfer' :groupObj='groupObj'  :friends='adminMembers'></choose-owner>
        </div>
                
    </div>
</template>
<script>
import ChooseOwner from './ChooseOwner';
import {  mapGetters } from 'vuex'

export default {
    props:["info"],
    components: {
            ChooseOwner,
            
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    data() {
        return {
            transferOwnerGroup : false,
            selectMemberList : [],
            groupObj:{
                title: '',
                okText: '',
                placeholder: '',
                holdtxt: '',
            },
            adminMembers: [],
            settingGroup : {
                ownerTansfer: false,
                hideMemberList: this.info.hideMemberList === 1 ? true : false,
                allowInvite: this.info.allowInvite === 1 ? true : false,
                allowShowQrCode: this.info.allowShowQrCode === 1 ? true : false,
                forbidLeave: this.info.forbidLeave === 1 ? true : false,
                showRoomNotice: this.info.showRoomNotice === 1 ? true : false,
                showMuteNotice: this.info.showMuteNotice === 1 ? true : false,
                forbidAddFriends: this.info.forbidAddFriends === 1 ? true : false,
                groupReview: this.info.groupReview === 1 ? true : false,
            }
        }
    },
    mounted() {
        this.selectMemberList.push(this.userInfo)
        this.adminMembers = this.info.members
    },
    methods: {
        openOwnerTransfer(){
            this.transferOwnerGroup = true
        },
        ownerTransfer(data){
            this.$emit('ownerTransfer', data)
        },
        updateSettings(){
            this.$emit('updateSettings', this.settingGroup)
        }
    },
}
</script>
<style lang="scss" scoped>
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
                color: #666;
                font-size: 16px;
                cursor: pointer;
                overflow: hidden;
                word-break: keep-all;
                text-overflow: ellipsis;

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