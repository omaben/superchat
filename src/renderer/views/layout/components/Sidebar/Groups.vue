<template>
<div class="session-list">
    <div class="add-chat" :class="{'border-style':chatListScroll > 0}">
        <div class="add-chat-btn" @click="showAddGroupFunc">
            <img  :src="require('@/assets/svg/createGroup.svg')" alt="">
            <div class="title-action">
                {{$t('createGroup')}}
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        
        
    </div>
    <div class="session-chat-list">
        <el-collapse v-model="activeNames" accordion class="overflow-height">
            <el-collapse-item :title="$t('groups_i_own')+'('+groupsOwnerSorted.length+')'" name="1" >
                <ul>
                    <li :class="{'active':chatActiveIdx == index}" v-for="(item, index) in groupsOwnerSorted" :key="index" @click="toChat(item,index)">
                        <div class="chat-avatar">
                            <img v-if="item.logo" :src="item.logo" alt="">
                            <p v-else>{{item.name&&item.name.slice(0,2) || item.nikeName&&item.nikeName.slice(0,2)|| item.receiver&&item.receiver.slice(0,2)}}</p>
                        </div>
                        <div class="chat-desc">
                            <h6>{{item.name || item.nikeName || item.receiver}}</h6>
                        </div>
                    </li>
                </ul>
            </el-collapse-item>
            <el-collapse-item :title="$t('groups_i_manage')+'('+groupsManageSorted.length+')'" name="2">
                <ul>
                    <li :class="{'active':chatActiveIdx == index}" v-for="(item, index) in groupsManageSorted" :key="index" @click="toChat(item,index)">
                        <div class="chat-avatar">
                            <img v-if="item.logo" :src="item.logo" alt="">
                            <p v-else>{{item.name&&item.name.slice(0,2) || item.nikeName&&item.nikeName.slice(0,2)|| item.receiver&&item.receiver.slice(0,2)}}</p>
                        </div>
                        <div class="chat-desc">
                            <h6>{{item.name || item.nikeName || item.receiver}}</h6>
                        </div>
                    </li>
                </ul>
             </el-collapse-item>
            <el-collapse-item :title="$t('groups_i_join')+'('+groupsMemberSorted.length+')'" name="3">
                <ul>
                    <li :class="{'active':chatActiveIdx == index}" v-for="(item, index) in groupsMemberSorted" :key="index" @click="toChat(item,index)">
                        <div class="chat-avatar">
                            <img v-if="item.logo" :src="item.logo" alt="">
                            <p v-else>{{item.name&&item.name.slice(0,2) || item.nikeName&&item.nikeName.slice(0,2)|| item.receiver&&item.receiver.slice(0,2)}}</p>
                        </div>
                        <div class="chat-desc">
                            <h6>{{item.name || item.nikeName || item.receiver}}</h6>
                        </div>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </div>

</div>
</template>

<script>
import { findUsersByRoomId} from "@/services";
import {
    mapGetters
} from 'vuex'

export default {
    components: {
    },
    data() {
        return {
            activeNames: ['1'],
            tabActive: 1,
            chatListScroll: 0,
            visible: false,
            showAddGroup: false,
            showAddPrivateChat: false,
            chatActiveIdx: -1,
            sortBy: 'name',
            sortDirection: 'asc',
        };
    },
    computed: {
        ...mapGetters([
            'rooms',
            'chatInfo',
            'userInfo',
        ]),
        groupsSorted: function(){
                return this.rooms.sort((p1,p2) => {
                    
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    return 0;
                });
        },
        groupsOwnerSorted : function(){
            let groupImOwner = this.rooms.filter(qry => qry.groupRole === 3)
            return groupImOwner.sort((p1,p2) => {
                    
                    let modifier = 1;
                    
                    if(this.sortDirection === 'desc') modifier = -1;
                    
                    if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    
                    return 0
            });
            
        },
        groupsManageSorted : function(){
            let groupImManage = this.rooms.filter(qry => qry.groupRole === 2)
            return groupImManage.sort((p1,p2) => {
                    
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    return 0;
            });
        },
        groupsMemberSorted : function(){
            let groupImMember = this.rooms.filter(qry => qry.groupRole === 1)
            return groupImMember.sort((p1,p2) => {
                    
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    return 0;
            });
        }
    },
    updated() {
        
        this.makeActiveCls();
        this.$bus.$off('upd_group')
        this.$bus.$on('upd_group', () => {
            this.$forceUpdate()
        })
    },
    mounted() {
        this.makeActiveCls();
        this.$bus.$off('upd_group')
        this.$bus.$on('upd_group', () => {
            this.$forceUpdate()
        })

    },
    methods: {
        async getMineInGroups(id){
            const [errInfo, dataInfo] = await this.awaitWrap(this.$store.dispatch('SetChatMembers', qry.id))
                if(errInfo){
                    this.$message.error(errInfo)
                    return
                }
            let me = dataInfo.find(item => item.id ===this.userInfo.id)
            if(me.role === 3){
                groupImOwner.push(me)
            }
        },
        sort: function(s){
                if(s === this.sortBy) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                }
                this.sortBy = s;
        },
        makeActiveCls(){
            if(this.chatInfo&&this.chatInfo.id==-1)return
            let fid = this.chatInfo&&this.chatInfo.roomIdAndId;
            if(fid){
                let actIndex = this.rooms.findIndex((value, index, arr) => {
                    return (value.roomIdAndId == fid) 
                })
                this.chatActiveIdx = actIndex
            }
        },
        scrollEvent() {
            let read = this.$el.querySelector('#list')
            this.chatListScroll = read.scrollTop;
        },
        showAddGroupFunc() {
            this.$store.dispatch('setCreateGroup',true)
            this.$store.dispatch('SetNotification',false)
             this.$store.dispatch('SetBroadcastList',false)
            this.$store.dispatch('SetSerieManage',false)
            this.$bus.$emit("filterNameGroup")
        },
        hideAddFroupBox() {
            this.showAddGroup = false;

        },
        showAddPrivateChatFunc() {
            this.visible = false;
            this.showAddPrivateChat = true;
        },
        hideAddPrivateChat() {
            this.showAddPrivateChat = false;
        },
        toChat(item, idx) {
            //if(this.chatActiveIdx==idx)return
            this.chatActiveIdx = idx;
            this.$store.dispatch('SetChatInfo', item);
            this.$bus.$emit('changeChat', true);
            this.$store.dispatch('setDetailFriend',false)
            this.$store.dispatch('setDetailGroup',false)
            this.$store.dispatch('SetChatBox',true)
        }

    },
};
</script>

<style lang="scss" scoped>
.session-list {
    position: relative;
    height: 100%;
    font-size: 16px;
    .add-chat {
        
        .add-chat-btn {
            display: flex;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            padding-bottom: 0;
            height: 55px;
            padding-top: 8px;
            cursor: pointer;
            img {
                width: 38px;
                height: 38px;
            }
            .title-action {
                border-bottom: 1px solid #E0E3E5;
                margin-left: 10px;
                flex: 1;
                align-items: center;
                height: 46px;
                font-size: 16px;
                color: #000;
                line-height: 41px;
                i {
                    float: right;
                    position: relative;
                    top: 17px;
                    color: #CDD1D3;
                    font-size: 13px;
                }
            }
        }

        &.border-style {
            box-shadow: 0 2px 2px rgba($color: #000000, $alpha: .1);
        }

    }

    .session-chat-list {
        height: calc(100% - 54px);
        box-sizing: border-box;

        ul {
           

            li {
                // height: 1000px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                box-sizing: border-box;
                padding-bottom: 0;
                height: 62px;
                padding-top: 8px;

                &.active {
                    background: #ceecfa !important;
                }

                &:hover {
                    cursor: pointer;
                    background: #dff1fa;
                }

                .chat-avatar {
                    width: 48px;
                    height: 48px;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }

                    p {
                        border-radius: 50%;
                        width: 48px;
                        height: 48px;
                        font-size: 12px;
                        color: var(--primary-color);
                        background: #e5e4e8;
                        font-weight: bold;
                        text-align: center;
                        line-height: 50px;
                    }
                }

                .chat-desc {
                    border-bottom: 1px solid #E0E3E5;
                    margin-left: 10px;
                    flex: 1;
                    align-items: center;
                    height: 56px;

                    h6 {
                            font-size: 16px;
                            color: #000;
                            font-weight: 500;
                            word-break: keep-all;
                            text-overflow: ellipsis;
                            max-width: 160px;
                            white-space: nowrap;
                            overflow: hidden;

                        }

                    p {
                        margin-top: 0;
                        font-size: 14px;
                        color: #999DA0;
                        overflow: hidden;
                        width: 240px;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                    }
                }

                .chat-time {
                    text-align: right;

                    .time {
                        font-size: 13px;
                        color: #666;
                    }

                    .number {
                        display: inline-block;
                        padding: 2px 5px;
                        box-sizing: border-box;
                        margin-top: 5px;
                        font-size: 12px;
                        background: #f56c6c;
                        border-radius: 10px;
                        text-align: center;
                        color: #fff;
                        font-weight: bold;
                    }
                }

            }
        }

    }

}
</style>
<style lang="scss">
.el-popover {
    padding: 0;
    width: 145px !important;
    min-width: 0 !important;
}

.add-chat-item {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;

    &:hover {
        color: var(--primary-color);
    }
}
.overflow-height{
    height: 100%;
    overflow: auto;
}
</style>
