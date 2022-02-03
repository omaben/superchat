<template>
    <div class="chat-box"  >
        <div class="chat-item ">
                <div class="chat-title">
                    <div class="add-chat-title">
                        <div class="settting-close" @click="hideMutedList">
                            <i class="el-icon-arrow-left" ></i> {{$t('back')}}
                        </div>
                        <h2>{{$t('muted_list')}}</h2>
                    </div>
                </div>
        </div>
        <el-row class="details-info bg-white">
            <ul class="member-in-group">
                <li v-for="(item,index) in mutedListData" :key="index">
                    <el-avatar v-if="item.photo" :src="item.photo"></el-avatar>
                    <el-avatar  v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                    <p>{{item.nikeName}} <i class="el-icon-delete-solid" @click="unmuteUser(item.userId,index)"></i></p>
                </li>
            </ul>
        </el-row>
    </div>
</template>
<script>
import {  mapGetters } from 'vuex'

import {
    unMuteUser,
} from '@/services'
export default {
    computed: {
        ...mapGetters([
            'mutedListData',
            'chatInfo'
        ])
    },
    methods: {
         async unmuteUser(userId , index) {
                let bannedListView = this.mutedListData
                let post = {
                    roomId: this.chatInfo.id, 
                    userId: userId
                }
                unMuteUser(post).then(res => {
                    bannedListView.splice(index, 1);
                    this.$store.dispatch('setMutedList',{item:true , data:bannedListView})

                    this.$message.success(res.message)
                })
        },
        hideMutedList(){
            this.$store.dispatch('setMutedList',{item:false , data:[]})
        },
    },
}
</script>
<style lang="scss" scoped>
.chat-box {
        position: relative;
        width: 100%;
        height: 100%;
        background: #F0F3F4;
        overflow: hidden;
        font-size: 16px;
        &.add-groups{
            background: #fff;
        }
        .chat-title {
                width: 100%;
                padding: 5px 0;
                box-sizing: border-box;
                border-bottom: 1px solid #ddd;
                display: block;
                align-items: center;
                background: #fff;
            .add-chat-title {
                position: relative;
                padding: 15px;
                box-sizing: border-box;
                background: #fff;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;

                h2 {
                    font-size: 18px;
                    text-align: center;
                }

                .settting-close {
                    position: absolute;
                    cursor: pointer;
                    font-size: 15px;
                    color: var(--primary-color);

                    /* &:hover {
                        color: #999;
                    } */
                }

                .add-member-btn {
                    position: absolute;
                    right: 15px;
                    top: 12px;
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
            .chat-top-title {
                width: 100%;
                display: flex;
                h2 {
                    flex: 1;
                    .title{
                        cursor: pointer;
                    }

                    span {
                        font-size: 25px;

                    }
                    .chat-tool {
                        margin-top: 10px;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        color: #888;

                        .tool-item {
                            padding-left: 10px;
                            padding-right: 10px;
                            cursor: pointer;

                            &:first-child {
                                padding-left: 0;
                            }

                            &:last-child {
                                border-right: 0;
                            }

                            &:hover {
                                color: #aaa;
                            }
                        }

                    }
                }

                .tool-icon {
                    width: 40px;
                    height: 40px;
                    background: #f0f0f0;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 45px;
                    cursor: pointer;
                    margin-left: 5px;
                    i {
                        font-size: 16pt;
                    }
                    img {
                        width: 20px;
                        height: 20px;
                    }

                    &:hover {
                        background: #e0e0e0;
                        color: var(--primary-color);
                    }
                }
            }
            .chat-top-search {
                width: 100%;
                padding: 10px 50px;
                margin-top: 15px;
                .search {
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 5px;
                    display: flex;
                    .search-box {
                        font-size: 9pt;
                        width: calc(100% - 150px);
                        display: inline-flex;
                        height: 20px;
                        img {
                            height: 14px;
                            margin-right: 7px;
                            position: relative;
                            top: 3px;
                        }
                        input{
                            width: 100%;
                        }
                        i.find-icon {
                            background: #ddd;
                            border-radius: 50%;
                            padding: 5px 4px;
                            font-size: 8pt;
                            height: 20px;
                            width: 20px;
                            margin-right: 15px;
                            cursor: pointer;
                            &:hover {
                                background: #ceecfa;
                                color: green;
                            }
                        }
                    }
                    .info-search{
                            &::before {
                            height: 38px;
                            width: 1px;
                            background: #ddd;
                            content: '';
                            position: absolute;
                            margin-top: -11px;
                        }
                        i.find-icon {
                            background: #ddd;
                            border-radius: 50%;
                            padding: 5px 4px;
                            font-size: 8pt;
                            height: 20px;
                            width: 20px;
                            margin-left: 5px;
                            cursor: pointer;
                            &:hover {
                                background: #ceecfa;
                                color: green;
                            }
                        }
                        span{
                            margin-left: 10px;
                        }
                    }
                    
                }
            }


        }
        .details-info{
            width: 460px;
            margin: 30px auto;
            margin-top: 15px;
            margin-bottom: 0;
            border-radius: 10px;
            overflow: hidden;
            height: calc(100% - 100px);
            padding-bottom: 10px;
            .general-info {
                text-align: center;
                .el-avatar {
                    width: 72px;
                    height: 72px;
                    line-height: 70px;
                    font-size: 26px;
                    text-transform: uppercase;
                }
                h6 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #000000;
                    margin-top: 5px;
                }
                p {
                    font-size: 14px;
                    font-weight: 100;
                    color: #999DA0;
                    line-height: 1.5;
                }
            }
            .action-info {
                height: 65px;
                text-align: center;
                padding: 10px;
                position: relative;
                cursor: pointer;
                border-radius: 15px;
                p {
                    font-size: 13px;
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    text-align: center;
                    color: #000000;
                    left: 0;
                }
            }
            .all-info-tabs {
                
                overflow: auto;
                padding: 10px;
                border-radius: 15px;
            }
        }
        .details-update{
            height: calc(100vh - 280px);
            overflow: auto;
            margin-left: -10px;
            margin-right: -10px;
            padding: 0 10px;
        }
    }
     ul.member-in-group {
         padding: 15px;
         li {
            display: inline-flex;
            width: 100%;
            line-height: 2.5;
            padding: 10px 0;
            position: relative;
            cursor: pointer;
            &:before {
                position: absolute;
                content: '';
                width: calc(100% - 50px);
                right: 0;
                bottom: 0;
                border-bottom: 1px solid #F0F3F4;
            }
            p {
                margin-left: 10px;
                font-size: 16px;
                font-weight: 100;
                color: #000;
                width: 100%;
                i {
                    float: right;
                    color: red;
                    font-size: 14px;
                    position: relative;
                    top: 12px;
                    padding: 4px 11px;
                    line-height: initial;
                    
                    &.green{
                        color: #00D94B;
                    }
                }
            }
        }
     }
</style>
