<template>
    <div style="overflow: auto;height: 100%;">
        <el-input :placeholder="$t('search')" v-model="memberSearch" class='search-action' @input='filterData'></el-input>
        <ul class="member-in-group">
            <li v-for="item in chatMembersSorting" :key="item.id" @click="detailInfo(item)">
                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                <p>{{item.id === userInfo.id ? 'You' : item.nikeName}} <span :class="{'green':item.role===2}">{{item.role | filterRole}}</span></p>
            </li>
        </ul>
        <div v-if="info.hideMemberList !=1 ||  info.groupRole === 3 || info.groupRole === 2">
            <el-collapse-transition>
                <ul class="member-in-group">
                    <li v-for="item in normalMembersSorting" :key="item.id" @click="detailInfo(item)">
                        
                        <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                        <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                        <p>{{item.id === userInfo.id ? 'You' : item.nikeName}} </p>
                        <img class="el-icon-delete-solid" :src="require('@/assets/svg/trash-ico.svg')" @click.stop="del(item)" v-if="(info.groupRole === 3 || info.groupRole === 2) && item.id!==userInfo.id&&item.role==1">

                    </li>
                </ul>
            </el-collapse-transition>
        </div>
            
    </div>
</template>
<script>
import { chatLocalMsgDAO,chatInRoomsDAO, roomListDao} from "@/services/db";
import {  mapGetters } from 'vuex'
import MSG_TYPE,{translateHTML} from "../../../services/im/constant" //调试用

export default {
    props: ["members","info"],
    mounted() {
        this.getAllMembers()
    },
    computed:{
        ...mapGetters([
            'friends',
            'userInfo'
        ]),
        chatMembersSorting: function(){
            if(this.members){
                let allMembers = []

                let membersAdmin = this.members.filter(qry=>qry.role===2)
                let membersOwner = this.members.find(qry=>qry.role===3)
                if(membersAdmin.length>0){
                        membersAdmin.sort((p1,p2) => {
                        
                            let modifier = 1;
                            if(this.sortDirection === 'desc') modifier = -1;
                            if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                            return 0;
                        });
                }
                allMembers.push(membersOwner)
                membersAdmin.forEach((item)=>{
                    allMembers.push(item)
                })
                return allMembers
            }
        
         
        },
        normalMembersSorting: function(){
            if(this.normalMembersfilter){
                if(this.normalMembersfilter.length>0){
                        this.normalMembersfilter.sort((p1,p2) => {
                        
                            let modifier = 1;
                            if(this.sortDirection === 'desc') modifier = -1;
                            if(p1[this.sortBy].toLowerCase() < p2[this.sortBy].toLowerCase()) return -1 * modifier; if(p1[this.sortBy].toLowerCase() > p2[this.sortBy].toLowerCase()) return 1 * modifier;
                            return 0;
                        });
                }
                return this.normalMembersfilter
            }
        },
    },
    data() {
        return {
            MSG_TYPE,
            sortBy : 'nikeName',
            viewAllMembers: false,
            normalMembers: [],
            normalMembersfilter: [],
            memberSearch:null
        }
    },
    methods: {
        filterData(){
            console.log('test')
            if(this.memberSearch!=''){
                this.normalMembersfilter = this.normalMembers.filter(qry => qry.nikeName.toLowerCase().indexOf(this.memberSearch.toLowerCase())>-1)
            }else{
                this.normalMembersfilter = this.normalMembers
            }
        },
         del(item){
            this.$bus.$emit('kick_room',item)
            this.viewAllMembers = false
        },
         async detailInfo(item){
             let uid = item.id;
             if(uid === this.userInfo.id){
                 return
             }
             let chatRoom2 = {}
                let userInfo = await this.fixInfo(1, {
                    userId: uid,
                }).catch((err) => {
                    this.$bus.$emit('show_dialog_err',err)
                });
                if(userInfo){
                    //userInfo.avatar=userInfo.nikeName
                    this.$store.commit('UPDATE_FRIENDS',userInfo)
                    userInfo.avatar = userInfo.nikeName
                    chatRoom2 = {...userInfo, roomType:1,isFromGroup:2}
                    let roomIdAndId = this.setRoomIdsId(userInfo.id, 1)
                    let getInstance = chatInRoomsDAO.getInstance();
                    let chatRoom = await getInstance.find(roomIdAndId)
                    if(chatRoom){
                        getInstance.update(chatRoom).then(()=>{
                            getInstance.get().then(result=>{
                                this.$store.commit('SET_CHATIN_ROOMS', result)
                            })
                        })
                    }

                    this.$store.dispatch('setDetailFriend',true)
                        this.$bus.$emit("getImages",0,[],[])
                        let images = []
                        let bigImages = []
                        chatLocalMsgDAO.getInstance().findByRoomIdAndId(roomIdAndId).toArray()
                            .then((listData)=> {
                                let imagesList = listData.filter(qry=>qry.msgType === MSG_TYPE.IM_MSG_TYPE_PICTURE)
                                imagesList.forEach(qry =>{
                                    images.push(JSON.parse(qry.msg).thumbUrl)
                                    bigImages.push(JSON.parse(qry.msg))
                            })
                            this.$bus.$emit("getImages",images.length > 16 ? 16 : images.length,images,bigImages)
                                

                    })

                }
            let isMute = false
            if(item.muteInt>0){
                isMute = true
            }
            this.$bus.$emit("openDetails", chatRoom2 , this.info.forbidAddFriends, isMute)
        },
        async getAllMembers(){
            if(!this.viewAllMembers){
                
                let roomInfo = await this.fixInfo(2, {
                roomIds: [this.info.roomId | this.info.id],
                
                }).catch((err) => {
                    
                    this.$bus.$emit("show_dialog_err", err);
                });
                if (roomInfo) {
                    
                    let info = { ...this.info, ...roomInfo};
                    await this.roomListInstance().editInstance(info)
                    let chatMembers = info.chatMember
                    this.$store.commit("SET_CHATMEMS", chatMembers); 
                    if(chatMembers&&chatMembers.length>0){
                        chatMembers.map(async(vt) => {
                            this.$store.commit('UPDATE_USERS_OBJ', vt)
                            await this.userListInstance().editInstance(vt)
                        })
                    }
                    this.normalMembers = chatMembers.filter(qry => qry.role === 1)
                    this.normalMembersfilter = this.normalMembers
                    if(this.memberSearch){
                    }
                }else{
                    
                    let roomId = this.info.roomId || this.info.id
                    let rooms = await roomListDao.getInstance().findByRoomId(roomId);
                    let chatMembers = rooms.chatMember
                    this.$store.commit("SET_CHATMEMS", chatMembers);
                    
                    this.normalMembers = chatMembers.filter(qry => qry.role === 1 )
                    this.normalMembersfilter = this.normalMembers
                }
            }
        }
            
    },
}
</script>
<style lang="scss" scoped>
    ul.member-in-group li {
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
        .el-avatar {
            img{
                width:50px !important;
                height: 50px !important;
            }
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
                    position: relative;
                    overflow: inherit;
                    width:59.95px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    text-transform: uppercase;
        }
        
        p {
            margin-left: 10px;
            font-size: 16px;
            font-weight: 100;
            color: #000;
            width: 100%;
            span {
                float: right;
                color: var(--primary-color);
                font-size: 14px;
                position: relative;
                top: 12px;
                background: #F0F3F4;
                padding: 4px 11px;
                line-height: initial;
                border-radius: 13px;
                &.green{
                    color: #00D94B;
                }
            }
        }
    }
    button.member-view-all {
        width: 100%;
        margin: 10px 0;
        text-transform: uppercase;
    }
    img.el-icon-delete-solid {
        float: right;
        width: 13px;
        position: relative;
    }
    .search-action.el-input input {
    background: #F0F3F4;
    border: none;
    border-radius: 16px;
}
</style>