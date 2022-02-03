<template>
    <div class="chat-box"  >
        <div class="chat-item ">
                <div class="chat-title">
                    <div class="add-chat-title">
                        <div class="settting-close" @click="back">
                             <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                             {{$t('back')}}
                        </div>
                        <h2>{{$t('blackList')}}</h2>
                    </div>
                </div>
        </div>
        <el-row class="details-info bg-white">
            <ul class="member-in-group">
                <li v-for="(item,index) in blacklist" :key="index">
                    <el-avatar v-if="item.photo" :src="item.photo"></el-avatar>
                    <el-avatar  v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                    <p>{{item.nikeName}}
                        <img class="el-icon-delete-solid" :src="require('@/assets/svg/trash-ico.svg')" @click="delBlackList(item)" alt="">
                    </p>
                </li>
            </ul>
        </el-row>
    </div>
</template>

<script>
import {
    userBlackList,
    delBlackList
} from '@/services'
export default {
    data() {
        
        return {
            blacklist : []
        };
    },
    mounted() {
        this.getUserBlackList()
    },
    methods: {
        back(){
                this.$emit('childBack', false)
            },
        async getUserBlackList(){
            await userBlackList().then(res =>{
                if(res.success){
                    this.blacklist = res.data
                }
            })
        },
        async delBlackList(item){
            let post = {
                friendId : item.id
            }
            this.$confirm(this.$t('isConfirmAction'), 'BlackList', {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(async() => {
                this.blacklist.splice(this.blacklist.indexOf(item), 1);
                await delBlackList(post).then(res => {
                    this.$store.dispatch('GetFriends')
                })
            }).catch(()=>{})
        }
        
    },
}
</script>

<style lang="scss" scoped>
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
    img.el-icon-delete-solid {
        float: right;
        width: 13px;
        position: relative;
        top: 10px;
    }
.info-box {
        background: #fff;
        position: relative;
        height: 100%;
        padding: 40px 30px;
        box-sizing: border-box;
        border-radius: 5px;
        overflow-y: scroll;

        h6 {
            margin-bottom: 20px;
            font-size: 12px;
            color: #999;
        }

        .info-item {
            padding: 16px 0;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            cursor: pointer;

            .info-item-icon {
                img {
                    width: 25px;
                }

                i {
                    font-size: 25px;
                }
                &.chat-avatar {
                    width: 35px;
                    height: 35px;

                    img {
                        width: 100%;
                        height: 100%;
                        width: 35px;
                        height: 35px;
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
                    }
                }
            }

            .info-item-title {
                margin-left: 10px;
                font-size: 14px;
                color: #333;
                cursor: pointer;
            }

            .info-item-cent {
                flex: 1;
                text-align: right;
                font-size: 14px;
                color: #999;
                cursor: pointer;
                i{
                    color: red;
                }

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
    .chat-box {
        position: relative;
        width: 100%;
        height: 100vh;
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
           width: 550px;
            margin: 30px auto;
            margin-top: 15px;
            margin-bottom: 0;
            border-radius: 10px;
            overflow: hidden;
            height: initial;
            padding-bottom: 0;
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
</style>
