<template>
    <div class="chat-box" >
        <div class="chat-item">
            
            <div class="chat-title">
                <div class="add-chat-title">
                    <div class="settting-close" @click="hideTeamsManage">
                        <i class="el-icon-arrow-left"></i> {{$t('back')}}
                    </div>
                    <h2>{{$t('customise_series')}}</h2>
                   <div class="add-member-btn">
                            <el-button v-show="!updateManage && !friendId" @click="editTeamManage" type="primary" size="small" round>{{$t('Edit')}}</el-button>
                            <el-button v-if="!friendId" v-show="updateManage"  @click="updateteamManage" type="primary" size="small" round>{{$t('Update')}}</el-button>
                            <el-button v-if="friendId"  @click="updateTeamFriend" type="primary" size="small" round>{{$t('Update')}}</el-button>
                    </div>
                </div>
            </div>
            <div class="manage-series">
                
                 <div id="teams" >
                        <div class="update-cent-item" 
                            v-for="(team,i) in teams" 
                            :key="team.id" 
                            draggable="true"
                            @dragover.prevent
                            @dragstart="dragStart(i, $event)"
                            @drop="dragFinish(i, $event)"
                            @dragend="dragEnd"                             >
                            <div class="update-item-title chat-name">
                                <p v-if="!editSeries"> <img :src="require('@/assets/svg/drop.svg')" alt="">{{team.teamName}} <span>({{getNumberofFirends(team.id)}})</span></p>
                                <input v-show="editSeries" type="text" :id="'inputNames'+team.id" v-model="team.teamName"  @keyup.enter="updateName(team.id)" >
                                <img class="deleteIcon" :src="require('@/assets/svg/trash.svg')"  alt="" @click="removeItem(team)" v-if="teams.length>1" v-show="editSeries">
                                <div class="team-checkbox " v-if="friendId" :class="{'select' : teamId === team.id}" @click="teamId = team.id">
                                    <i class="el-icon-check" v-if="teamId === team.id"></i>
                                </div>
                            </div>
                        </div>
                </div>
                <div class=" action-item" v-if="!editSeries && !friendId" @click="openAddSeries = true">
                    <img  :src="require('@/assets/svg/plus-series.svg')" alt="">
                    <span>{{$t('add_new_series')}}</span>
                </div>
                <el-dialog
               :title="$t('series_name')"
                :visible.sync="openAddSeries"
                width="30%"
                class="add-series"
                >
                    <div class="update-item-title chat-name">
                        <input type="text" v-model="nameTeam"  :placeholder="$t('please_enter_series_name')" @keyup.enter="addItem">
                        <el-button type="primary" @click="addItem">{{$t('submit')}}</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { editUserTeam, delUserTeam,  updateTeam,} from "@/services";

import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            dragging: -1,
            nameTeam: '',
            checkDisabled: -1,
            oldNameSelected: '',
            editSeries: false,
            updateManage:false,
            openAddSeries:false,
            friendId : null,
            teamId:null,
        }
    },
    mounted() {
        this.$bus.$off('updateTeamFriend')
        this.$bus.$on('updateTeamFriend', (friendId,teamId) => {
                this.friendId = friendId
                this.teamId = teamId
        })
    },
    
    computed: {
        ...mapGetters([
            'userInfo',
            'friends',
            'teams'
        ]),
        isDragging() {
            return this.dragging > -1
        },
        

    },
    methods: {
        updateTeamFriend(){
            
            let post = {
                friendId : this.friendId,
                teamId : this.teamId
            }
            updateTeam(post).then(async(res) => {
                if(res.success){
                    this.$store.dispatch('GetTeams')
                    this.$store.dispatch('GetFriends')
                    this.$message.success(res.message)
                    this.$store.dispatch('SetSerieManage',false)
                    this.$store.dispatch('setDetailFriend',false)
                    this.friendId = null
                    this.teamId = null
                }
            })
        },
        getFriendId(id){
            console.log(id,'88888')
            this.friendId = id
        },
        getNumberofFirends(teamId){
            return this.friends.filter(qry => qry.teamId === teamId).length
        },
         removeItem(item) {
            let post = {
                    id	: item.id
                }
            this.$confirm(this.$t('desc_sure_to_delete_series'), this.$t('sure_to_delete_series'), {
                confirmButtonText: this.$t('submit'),
                cancelButtonText: this.$t('cancel'),
            }).then(async() => {
                this.teams.splice(this.teams.indexOf(item), 1);
                this.teams.forEach((element,index) => {
                    element.sort = index + 1
                });
                await delUserTeam(post).then((res) => {
                    
                })
            }).catch(()=>{})
            
        },
        focusInputs(id) {
            document.getElementById('inputNames'+id).focus();
        },
        updateCheckDisabled(id,status){
           
            if(status){
                this.checkDisabled = id
                let that = this
                setTimeout(function(){
                    that.focusInputs(id)
                },500)
            }else{
                this.checkDisabled = -1
            }
        },
        addItem() {
            if (!this.nameTeam) {
                return;
            }
            this.teams.push({
                id: 0,
                teamName: this.nameTeam,
                sort: this.teams[this.teams.length - 1].sort + 1
            });
            this.nameTeam = "";
            this.updateManage = true
            this.openAddSeries = false
        },
        dragEnd(ev) {
            this.dragging = -1
        },
        removeItemAt(index) {
            this.teams.splice(index, 1);
        },
        moveItem(from, to) {
            if (to === -1) {
                this.removeItemAt(from);
            } else {
                this.teams.splice(to, 0, this.teams.splice(from, 1)[0]);
            }
        },
        dragStart(which, ev) {
            this.dragging = which;
            /* ev.dataTransfer.setData('Text', this.id);
            ev.dataTransfer.dropEffect = 'move'
            this.dragging = which; */
        },
        dragFinish(to, ev) {
            this.moveItem(this.dragging, to);
            this.teams.forEach((element,index) => {
                element.sort = index + 1
            });
            this.updateManage = true
            /* ev.dataTransfer.setData('Text', this.id);
            ev.dataTransfer.dropEffect = 'move'
            this.dragging = which; */
        },

        hideTeamsManage() {
            if(!this.updateManage){
                this.$store.dispatch('SetSerieManage',false)

            }
            this.$store.dispatch('GetTeams').then().catch(err=>{
                this.$message.error(err)
            })
            this.updateManage = false
            this.editSeries = false
            this.friendId = null
                    this.teamId = null
            
        },
        editTeamManage(){
            this.updateManage = true
            this.editSeries = true
        },
        updateteamManage() {
            let data = JSON.stringify(this.teams)
            let post = {
                data : data
            }
            editUserTeam(post).then((res) => {
                if(res && res.success){
                    this.hideTeamsManage()
                    this.$message.success(res.message)
                }else{
                    //this.$message.error(res.message)
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.add-chat-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;

    .add-chat-mark {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #fff, $alpha: .9);

    }

    .add-chat-cent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 480px;
        height: 600px;
        background: #fff;
        border-radius: 5px;

        .add-chat-title {
            position: relative;
            padding: 15px;
            box-sizing: border-box;
            background: #fff;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;

            h2 {
                font-size: 24px;
                text-align: center;
                font-weight: normal;
            }

            .settting-close {
                font-size: 20px;
                position: absolute;
                cursor: pointer;

                &:hover {
                    color: #999;
                }
            }

            .add-member-btn {
                position: absolute;
                right: 15px;
                top: 12px;

            }
        }

        .search-member {
            position: relative;
            width: 100%;
            background: #f0f0f0;

            input.seachbox {
                padding: 0 75px 0 25px;
                box-sizing: border-box;
                font-size: 16px;
                color: #fff;
                width: 100%;
                height: 60px;
                background: transparent;
                border: 0;
                outline: none;
                box-shadow: none;
                &:focus {
                    border: 0;
                    outline: none;
                    box-shadow: none
                }
            }

            .clear {
                display: none;
                position: absolute;
                right: 20px;
                top: 17px;
                font-size: 24px;
                cursor: pointer;
            }

            &.inSearchFouc {
                background: linear-gradient(45deg, #317ace, #52baed);

                ::-webkit-input-placeholder {
                    /* WebKit browsers */
                    color: #ddd;
                    font-size: 16px;
                }

                ::-moz-placeholder {
                    /* Mozilla Firefox 19+ */
                    color: #ddd;
                    font-size: 16px;
                }

                :-ms-input-placeholder {
                    /* Internet Explorer 10+ */
                    color: #ddd;
                    font-size: 16px;
                }

                .clear {
                    display: block;
                    color: #fff;
                }

            }
        }
        
        .member-list,.add-friend {
            height: calc(100% - 59px);
            overflow: auto;
            
            border-top: 1px solid #ddd;
            h6 {
                margin: 10px;
                font-size: 12px;
                color: #999;
            }

            .member-item {
                padding: 0 10px;
                display: flex;
                align-items: center;
                font-size: 14px;
                cursor: pointer;

                &:hover {
                    background: #f9f9f9;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;

                    .no-avatar,img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f0f0f0;
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

                .member-name {
                    position: relative;
                    margin-left: 10px;
                    padding-right: 10px;
                    flex: 1;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    justify-content: space-between;
                    span {
                        display: inline-block;
                        width: 300px;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .add-btn{
                        background: #2b2c33;
                        color: #fff;
                        outline: none;
                        border: 0;
                    }
                }
            }

        }
        .add-friend{
            height: auto;
        }

    }

}

.update-cent-item {
            margin: 10px 15px;
            padding: 15px 0;
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
        
.chat-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: #F0F3F4;
    overflow: hidden;
    font-size: 16px;

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
    .manage-series {
        width: 400px;
        background: #fff;
        margin: 30px auto;
        margin-top: 100px;
        border-radius: 10px;
        #teams{
            padding: 0 21px;
            .update-cent-item {
                    width: 100%;
                    cursor: move;
                    margin: 0;
                    display: block;
                    
                    .update-item-title {
                    display: block;
                    position: relative;
                        &.chat-name{
                           p{
                               font-weight: 400;
                                text-transform: capitalize;
                                color: #4C4F50;
                                font-size: 15px;
                                img{
                                    margin-right: 7px;
                                }
                                span{
                                    color: #999DA0;
                                    font-weight: 400;
                                }
                           }
                           input{
                                border: none;
                                outline: none;

                           }
                           img{
                               &.deleteIcon{
                                   float: right;
                                   cursor: pointer;
                               }
                           }
                        }
                        .deleteIcon{
                            right: initial;
                            left: 0;
                            color: red;
                        }
                        input.disabled{
                            color: gray;
                        }
                    }
                    &:last-child{
                        border-bottom: 0;
                    }
            }
        }
        .action-item {
            text-align: center;
            border-top: 1px solid #ddd;
            padding: 16px;
            color: #000000;
            cursor: pointer;
            span{
                position: relative;
                top: -5px;
            }
        }
    }

    
}
.team-checkbox {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translate(0, -50%);
                        width: 20px;
                        height: 20px;
                        border: 1px solid #ddd;
                        border-radius: 50%;
                        cursor: pointer;
                        i{
                            font-size: 14px !important;
                            margin: 0 !important;
                            top: -2px;
                            position: relative;
                        }
                        &.select {
                            border: 0;
                            background: linear-gradient(45deg, #317ace, #52baed);
                            text-align: center;
                            line-height: 25px;
                            font-size: 18px;
                            color: #fff;
                        }

                    }
.add-series{
                        .update-item-title{
                            &.chat-name {
                                input {
                                    height: 32px;
                                    padding: 0 10px;
                                    width: 250px;
                                    border: 1px solid #E0E3E5;
                                    font-size: 12px;
                                    outline: none;
                                }
                                button{
                                    float: right;
                                    height: 34px;
                                    padding-top: 8px;
                                    text-transform: capitalize;
                                }
                            }
                        }
                    }
</style>
