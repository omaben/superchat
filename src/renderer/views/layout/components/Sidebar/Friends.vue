<template>
<div class="session-list">
    <div class="add-chat" :class="{'border-style':chatListScroll > 0}">
        <div class="add-chat-btn" @click="isShowAddFrd=true">
            <img  :src="require('@/assets/svg/add-friend.svg')" alt="">
            <div class="title-action">
                {{$t('addFriend')}}
                <i class="el-icon-arrow-right"></i>
            </div>
            
        </div>
        <div class="add-chat-btn" @click="openSerieManage()" >
            <img  :src="require('@/assets/svg/serie-manage.svg')" alt="">
            <div class="title-action">
                {{$t('customise_series')}}
                <i class="el-icon-arrow-right"></i>
            </div>
            
        </div>
    </div>
    <div class="session-chat-list">
        <el-collapse v-model="activeNames" accordion class="overflow-height">
            <el-collapse-item :title="getNumberofFirends(team)" :name="index" v-for="(team,index) in teams" :key="team.id">
                <ul>
                    <li v-for="(item,idx) in friendsSorted " 
                        :class="{'active':chatActiveIdx == idx}"
                        :key="idx"
                        @click="toChat(item,idx)"
                        v-show="item.teamId === team.id">

                        <div class="chat-avatar" :class="{'with-status':item.onlineStatus=== 1}" >
                            <img v-if="item.photo" :src="item.photo" alt="">
                            <p v-else>{{item.nikeName&&item.nikeName.slice(0,3) || item.account&&item.account.slice(0,3)}}</p>
                        </div>
                        <div class="chat-desc">
                            <h6>{{item.nikeName||item.account}} </h6>
                            <p>{{item.sign}}</p>
                        </div>
                    
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </div>
    <add-private-chat v-if="isShowAddFrd" @hideSetBox="hideFrd" @addFriend="getFriend"></add-private-chat>
    <teams-manage v-if="isShowTeams" @hideTeamsManage="hideTeams"></teams-manage>

    <el-dialog :title="$t('addFriend')" :visible.sync="isShowRemark" class="request-friend" :modal-append-to-body="false">
        <el-row>
            <el-col v-if="friendItem.nikeName" :span="4" class="img-request">
                <img v-if="friendItem.photo"  :src="friendItem.photo" alt="">
                <p v-else>{{friendItem.nikeName.slice(0,2)}}</p>
            </el-col>
            <el-col :span="20" class="form-request">
                 <el-form :model="form" label-position="top" >
                    <el-form-item :label="friendItem.nikeName" :label-width="formLabelWidth">
                        <el-input rows='5' :placeholder="$t('EnterRemarks')" type="textarea" v-model="form.addFRemark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
               
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelFriend()">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="addFriend()">{{$t('submit')}}</el-button>
                </div>
    </el-dialog>


</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {addUserRelation, delteUserRealation, queryUserByAccount, queryUsersByIds} from '@/services'
import AddPrivateChat from "@/components/AddChat/AddPrivateChat";
import TeamsManage from "@/components/AddChat/TeamsManage";

export default {
    components:{
        AddPrivateChat,
        TeamsManage
    },
    data() {
        return {
            isShowTeams: false,
            activeNames: [0],
            tabActive: 1,
            chatListScroll: 0,
            isShowAddFrd: false,
            form: {
                addFRemark: '',
            },
            isShowRemark: false,
            formLabelWidth: '120px',
            friendItem:{},
            chatActiveIdx: -1,
            sortBy: 'nikeName',
            sortDirection: 'asc',

        };
    },
    computed: {
        
        ...mapGetters([
            'friends',
            'chatInfo',
            'usersObj',
            'teams'
        ]),
        friendsSorted: function(){
                return this.friends.sort((p1,p2) => {
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy] && p2[this.sortBy]){
                        if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                    }
                    return 0;
                });
        },
        
        
        
    },
    
    created() {
        this.form = {
            addFRemark: ''
        }
    },
    updated() {
        this.makeActiveCls();
        this.$bus.$off('usersupd')
        this.$bus.$on('usersupd', () => {
            this.$forceUpdate()
            //console.log('强制更新该组件friend',this.usersObj)
        })
        this.$bus.$off('addNewFirend')
        this.$bus.$on('addNewFirend', () => {
            this.isShowAddFrd=true
             console.log('testuuuuu' ,this.isShowAddFrd)
            //console.log('强制更新该组件friend',this.usersObj)
        })

    },

    mounted() {
        
        this.makeActiveCls();
        this.$bus.$off('usersupd')
        this.$bus.$on('usersupd', () => {
            this.$forceUpdate()
            //console.log('强制更新该组件friend',this.usersObj)
        })
        this.$bus.$off('addNewFirend')
        this.$bus.$on('addNewFirend', () => {
            this.isShowAddFrd=true
            console.log('testuuuuu' ,this.isShowAddFrd)

            //console.log('强制更新该组件friend',this.usersObj)
        })
    },
    methods: {
        getNumberofFirends(team){
            return team.teamName + ' ('+this.friends.filter(qry => qry.teamId === team.id).length+')'
        },
        openSerieManage(){
             this.$store.dispatch('SetSerieManage',true)
             this.$store.dispatch('SetBroadcastList',false)
             this.$store.dispatch('SetNotification',false)
             this.$store.dispatch('setCreateGroup',false)
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
                let actIndex = this.friends.findIndex((value, index, arr) => {
                    return (value.roomIdAndId == fid)
                })
                this.chatActiveIdx = actIndex
            }
        },
        toChat(item, idx) {
            //if(this.chatActiveIdx==idx)return
            this.chatActiveIdx = idx;
            this.$store.dispatch('SetChatInfo', item);
            this.$store.dispatch('SetChatBox',true)
            this.$bus.$emit('changeChat', true);
            this.$store.commit('SET_EVAL', '')
            this.$store.dispatch('setDetailFriend',false)
            this.$store.dispatch('setDetailGroup',false)
        },
        cancelFriend(){
            this.isShowRemark = false
            this.form = {
                addFRemark: ''
            }
        },
        getFriend(item){
            this.friendItem = item;
            console.log('item',item)
            this.form = {
                addFRemark: ''
            }
            this.isShowRemark=true;
        },
        // 添加好友
        addFriend(){
            let post = {
                friendId: this.friendItem.id,
                remark: this.form.addFRemark
            }
            addUserRelation(post).then(res => {
                let dedata = res;
                if(dedata.success){
                    this.cancelFriend();
                    this.$message.success(this.$t('applyHasSent'));
                    this.$bus.$emit('addfriend_init');
                    // this.$store.dispatch('AddFriends',this.friendItem);
                    // 重新进入列表一个房间
                    // this.$store.dispatch('SetChatInfo', this.friendItem);
                    // this.$store.dispatch('AddChatInRooms', {...this.friendItem,roomType: 1})
                }else{
                    this.$message.error(dedata.message)
                    // this.$bus.$emit('addfriend_init')
                }
            })

        },
        scrollEvent() {
            let _this = this
            let read = _this.$el.querySelector('#list')
            this.chatListScroll = read.scrollTop;
        },
        hideFrd() {
            this.isShowAddFrd = false;
        },
        hideTeams() {
            this.$store.dispatch('GetTeams').then().catch(err=>{
                this.$message.error(err)
            })
            this.isShowTeams = false
        }

    },
};
</script>

<style lang="scss" scoped>
.session-list {
    position: relative;
    height: 100%;

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
        height: calc(100% - 110px);
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
                    position: relative;
                    &.with-status:before{
                        content: '';
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        width: 16px;
                        height: 16px;
                        border: 3px solid #f0f0f0;
                        background: var(--primary-color);
                        border-radius: 50%;
                    }
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

            }
        }
    }
}
.overflow-height{
    height: 100%;
    overflow: auto;
}
.img-request {
                    width: 48px;
                    height: 48px;
                        margin-right: 10px;
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
</style>
