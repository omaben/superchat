<template>
    <div class="update-info">
			<div class="update-info-mark"></div>
			<div class="update-info-cent">
				<div class="update-info-close" >
					<i class="el-icon-circle-close" @click="hideBusinessCard()"></i>
				</div>
				<div class="update-cent-top-title">
					<p>{{$t('Share Business Card')}} </p>
				</div> 
                <div class="session-chat-list">
                    <el-collapse v-model="activeNames" accordion>
                        <el-collapse-item :title="team.teamName" :name="team.id" v-for="team in teams" :key="team.id">
                            <ul>
                                <li v-for="(item,idx) in friendsSorted " 
                                    :key="idx"
                                    @click="selectBusinessCard(item)"
                                    :class="{'active':itemSelected && itemSelected.id === item.id}"
                                    v-show="item.teamId === team.id">
                                    
                                    <div class="chat-avatar">
                                        <img v-if="item.photo" :src="item.photo" alt="">
                                        <p v-else>{{item.nikeName&&item.nikeName.slice(0,3) || item.account&&item.account.slice(0,3)}}</p>
                                    </div>
                                    <div class="chat-desc">
                                        <h6>{{item.nikeName||item.account}}</h6>
                                        <p>{{item.sign}}</p>
                                    </div>
                                
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <el-row class="send-business-card">
                    <el-button type="primary" :loading="loading" @click="sendBusinessCard()" :disabled="!itemSelected">Send</el-button>
                </el-row>
			</div>
			
		 </div>
</template>
<script>
import MSG_TYPE from "@/services/im/constant";
import {  mapGetters } from 'vuex'

export default {
	name:"chooseFile",
	props: {
        friendsSorted: {
			type: Array,
			default: () => {
				return []
			}
        },
        
    },
	computed: {
        ...mapGetters([
            'userInfo',
			'teams'
        ]),
        
    },
    data() {
		return {
			activeNames : '1',
            loading: false,
            itemSelected:null
		}
	},
    methods: {
        selectBusinessCard(friend){
            this.itemSelected = friend
        },
        hideBusinessCard() {
            this.$emit('hideBusinessCard')
        },
        sendBusinessCard(){
            this.$emit('sendBusinessCard',this.itemSelected)
            this.itemSelected = null
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .update-info {
       
    font-size: 16px;
    position: fixed;
    top: 0;
    left: 0;
     z-index: 10000;
    width: 100%;
    height: 100%;
    .chat-avatar {
                    width: 35px;
                    height: 35px;
                    margin-left: 10px;
                    img {
                        width: 100%;
                        height: 100%;
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

                .chat-desc {
                    margin-left: 4px;
                    flex: 1;
                    align-items: center;
                    padding-top: 5px;

                    h6 {
                        font-size: 14px;
                        color: #2b2c33;
                        font-weight: 500;

                    }

                    p {
                        margin-top: 5px;
                        font-size: 14px;
                        color: #999;
                        overflow: hidden;
                        width: 240px;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                    }
                }
    .details-msg-batch{
        margin: 15px;
    }
    .el-card__header{
        i{
            margin-left: 10px;
        }
        .member-name{
            overflow: hidden;
            word-break: keep-all;
            text-overflow: ellipsis;
            max-width: 340px;
            white-space: nowrap;
            display: inline-block;
        }
    }
    .feedback-input {
        margin-bottom: 20px;
    }

    .update-info-mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: .5);

    }

    .update-info-cent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 480px;
        height: 90%;
        max-height: 19cm;
        background: #f1f1f4;
        border-radius: 5px;
        overflow-y: auto;
        .el-collapse.allreceiveID {
            
            background: #fff;
        }
        .update-info-cent{
            height: 100%;
        }
        .update-info-close {
            position: absolute;
            left: 25px;
            top: 15px;
            font-size: 24px;
            color: #fff;
            cursor: pointer;

            &:hover {
                color: #ccc;
            }

        }

        .update-cent-title {
            width: 100%;
            height: 125px;
            background: linear-gradient(45deg, #317ace, #52baed);
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;

            .avatar {
                position: absolute;
                left: 50%;
                top: 23px;
                transform: translate(-50%, 0);
                width: 120px;
                height: 120px;
                border-radius: 50%;

                &.online {
                    position: relative;

                    &::before {
                        content: '';
                        position: absolute;
                        right: 6px;
                        bottom: 6px;
                        width: 22px;
                        height: 22px;
                        border: 3px solid #fff;
                        background: #39cc7e;
                        border-radius: 50%;
                    }
                }

                .no-avatar,img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    font-size: 50px;
                    color: #333;
                    background: #f1f1f4;
                    text-align: center;
                    line-height: 120px;
                    cursor: pointer;

                }
                .vname{
                    width: 120px;
                    height: 120px;
                    font-size: 50px;
                    color: var(--primary-color);
                    border-radius: 50%;
                    background: #e5e4e8;
                    text-align: center;
                    line-height: 120px;
                }
            }
            

        }
        .cent-notice{
            display: flex;
            line-height: 37px;
            .texts{
                flex: 1;
            }
        }
        .update-cent-name {
            margin: 25px 50px;
            position: relative;
            .nametit{
                font-size: 24px;
                color: #333;
                text-align: center;
                font-weight: 500;
            }
            .tips{
                margin-bottom: 25px;
                font-size: 14px;
                color: #8d8d91;
            }
            .persons{
                font-size: 18px;
                .line-in{
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 0 10px;
                    &:hover{
                        background: #f8f8f9;
                    }
                    .avatar{
                        width: 40px;
                        height: 40px;
                        font-size: 20px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 40px;
                        margin-right: 10px;
                        img{
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                        }
                    }
                    .rcent{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        border-bottom: 1px solid #d6d9de;
                        height: 55px;
                        .name{
                            font-weight: 500;
                        }
                        .button{
                            font-size: 14px;
                            border: 1px solid #2b2c33;
                            border-radius: 20px;
                            cursor: pointer;
                            padding: 10px 15px;
                        }
                    }
                }
            }

            input {
                padding: 5px;
                box-sizing: border-box;
                font-size: 24px;
                color: #333;
                font-weight: bolder;
                text-align: center;
                width: 100%;
                border: 0;
                cursor: pointer;
                outline: none;
                border: none;
                &:focus {
                    border-bottom: 1px solid #ddd !important;
                    cursor: text;
                }

                &:hover {
                    color: #666;
                }
            }

            .update-name-icon {
                position: absolute;
                right: -30px;
                top: 4px;
                font-size: 26px;
                color: #999;
                cursor: pointer;

                &:hover {
                    color: #333;
                }
            }
        }
        .new-person{
            margin: 25px 20px;
        }

        .update-cent-item {
            margin: 10px 15px;
            padding: 10px 0;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;

            .update-item-title {
                font-size: 16px;
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

    .qr-code {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 101;
        width: 100%;
        height: 100%;

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
                height: 450px;
                background: #fff;
                box-shadow: 0 0 10px rgba($color: #000000, $alpha: .5);
                border-radius: 10px;
                padding: 20px 30px;
                box-sizing: border-box;

                .qr-code-avatar {
                    margin: 10px 0;
                    display: inline-flex;
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
                    position: absolute;
                    top: 139px;
                    height: 200px;
                    width: 200px;
                    left: 50px;
                    text-align: center;
                }

                p {
                    margin-top: 10px;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
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
}
.update-cent-top-title {
    background: linear-gradient(45deg, #317ace, #52baed);
    padding: 20px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    span.sendMsg {
        float: right;
        cursor: pointer;
        letter-spacing: initial;
        i{
            padding-left: 5px;
            top: -5px;
        }
    }
    i{
        float: right;
        cursor: pointer;
        font-size: 18pt;
        position: relative;
        top: -3px;
    }
}
.session-chat-list {
        height: calc(100% - 134px);
        box-sizing: border-box;
        overflow: auto;

        ul {
            height: calc(100% - 153px);
            overflow-y: auto;

            li {
                // height: 1000px;
                display: flex;
                align-items: center;
                padding: 15px 10px;
                box-sizing: border-box;

                &.active {
                    background: #ceecfa !important;
                }

                &:hover {
                    cursor: pointer;
                    background: #dff1fa;
                }

                .chat-avatar {
                    width: 35px;
                    height: 35px;

                    img {
                        width: 100%;
                        height: 100%;
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

                .chat-desc {
                    margin-left: 10px;
                    flex: 1;
                    align-items: center;

                    h6 {
                        font-size: 14px;
                        color: #2b2c33;
                        font-weight: 500;

                    }

                    p {
                        margin-top: 5px;
                        font-size: 14px;
                        color: #999;
                        overflow: hidden;
                        width: 240px;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                    }
                }

            }
        }
    }
.send-business-card {
    text-align: right;
    padding: 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
        min-width: 150px;
    }
}
</style>