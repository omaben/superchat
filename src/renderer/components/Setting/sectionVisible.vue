<template>
<el-container class="profile-info">
            <el-header>
                <div style="position:relative">
                    <div class="backInfo" @click="back">
                        <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                        <span>{{$t('back')}}</span>
                    </div>
                    <p>{{$t('whoCanWatch')}}</p>
                    <div class="add-member-btn">
                            <el-button type="primary" @click="submitForm('ruleForm')">{{$t('Update')}}</el-button>
                    </div>
                </div>
            </el-header>
            <el-main class="session-list">
                
                <div class="update-box session-chat-list">
                    <ul class="list-section" v-show="listSection.length>0">
                        <li v-for="(item,idx) in listSection" 
                            :key="idx" 
                            @click="selectFriend(item,idx)"
                            
                            >
                            <div class="chat-avatar" v-if="idx<5">
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                             </div>
                            <div class="chat-avatar" v-if="idx>4">
                                <p>+</p>
                            </div>
                        </li>
                    </ul>
                     <ul id="list">
                        <li v-for="(item,idx) in friends" 
                            :class="{'active':chatActiveIdx == idx}"
                            :key="idx" 
                            @click="selectFriend(item,idx)"
                            v-show="friends.length>0">

                            <div class="chat-avatar">
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-if="item.photo" :src="item.photo"></el-avatar>
                                <el-avatar :class="{'with-status':item.onlineStatus=== 1}" v-else>{{item.nikeName.slice(0,2)}}</el-avatar>
                             </div>
                            <div class="chat-desc">
                                <h6>{{item.nikeName}}</h6>
                                <p>{{item.remark}}</p>
                            </div>
                            <i class="el-icon-circle-check icon-select" v-if="!checkSection(item)"></i>
                            <i class="el-icon-circle-close icon-select" v-if="checkSection(item)"></i>
                        
                        </li>
                    
                    </ul>
                </div>
                
            </el-main>
            
        </el-container>

</template>

<script>
import {
    mapGetters
} from 'vuex'
import {addUserRelation, delteUserRealation, queryUserByAccount, queryUsersByIds} from '@/services'
import {accountSetShow,getAccountShow} from '@/services'

export default {
    components:{
        
    },
    data() {
        return {
            tabActive: 1,
            chatListScroll: 0,
            isShowAddFrd: false,
            form: {
                addFRemark: '',
            },
            isShowRemark: false,
            formLabelWidth: '120px',
            friendItem:{},
            listSection:[],
            chatActiveIdx: -1,
            

        };
    },
    computed: {
        ...mapGetters([
            'friends',
            'chatInfo',
            'usersObj'
        ])
    },
    created() {
        this.form = {
            addFRemark: ''
        }
        this.AccountShow()
    },
    updated() {
       
    },

    mounted() {
        this.AccountShow()
        
    },
    methods: {
        AccountShow(){
            getAccountShow().then(res =>{
                if(res.success){
                    if(res.data.showUsers){
                        this.listSection=[...res.data.showUsers]
                    }
                }
            })
        },
        makeUserMsg(item,status){
            let idf = this.getRoomIdsId(item.roomIdAndId)
            let pickObj = this.usersObj[idf];
            let val
            if(pickObj){
                if(status==1){
                    val = pickObj.photo
                }else if(status==2){
                    val = pickObj.nikeName
                }
            }
            return val || ''
        },
        selectFriend(item, idx) {
            
            let section=this.listSection.find(qry=>qry.id==item.id)
            if(section){
                this.listSection.forEach((qry,key)=>{
                    if(qry){
                        if(section.id==qry.id){
                            this.listSection.splice(key,1)
                        }
                    }
                    
                })
                
            }else{
                this.listSection.push(item)
            }
        },
        back() {
            this.$emit('childBack', false)
        },
        checkSection(item){
            let section=this.listSection.find(qry=>qry.id==item.id)
            if(section){
                return true
            }else{
                return false
            }
        },
        submitForm(){
            let showIds=null
            this.listSection.forEach((item)=>{
                if(item){
                    if(showIds){
                    showIds+=','+item.id
                    }else{
                        showIds=item.id.toString()
                    }
                }
            })
            
            let post = {
                isShow: 3,
                showIds:showIds
            }
            accountSetShow(post).then(res => {
                if(res.success){
                    
                    this.$message.success('Your profile is section')
                    this.back()      
                }else{
                    this.$message.error(res.message)
                }
            })
        }

    },
};
</script>

<style lang="scss" scoped>
.session-list {
    position: relative;
    height: 100%;

    .add-chat {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;

        .add-chat-btn {
            width: 100%;
            height: 32px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: #fff;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            img{
                width: 18px;
                vertical-align: middle;
            }

        }

        &.border-style {
            box-shadow: 0 2px 2px rgba($color: #000000, $alpha: .1);
        }

    }

    .session-chat-list {
        height: initial;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        padding: 17px;

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
                    width: 40px;
                    height: 40px;
                    .el-avatar {
                        
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
                               
                    }
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
                    position: relative;
                    top: 7px;

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
}
h5 {
            font-size: 16px;
            color: #333;
            cursor: pointer;
            margin-bottom: 30px;
            width: 100%;
            i {
                vertical-align: middle;
                margin-right: 10px;
                font-size: 20px;
            }
        }
ul.list-section {
    height: 45px!important;
    border-bottom: 1px solid #F0F3F4;
}
i.icon-select {
    font-size: 17pt;
    color: green;
}
.el-icon-circle-close.icon-select {
    color: red;
}
ul.list-section li {
    display: inline-block!important;
    padding-top: 0px!important;
    &:hover{
        background:transparent!important;
    }
}
ul.list-section {
    display: flex;
}
.sub-btn {
        margin-top: 20px;

        button {
            width: 120px;
            float: right;
        }
    }
    .update-box {
    position: relative;
    width: 500px;
    margin: 0 auto;

    h5 {
        font-size: 16px;
        color: #333;
        cursor: pointer;

        i {
            vertical-align: middle;
            margin-right: 10px;
            font-size: 20px;
        }
    }

    p {
        font-size: 14px;
        color: #999DA0;
        margin-bottom: 15px;
    }

    .update-input {
        border: none;
        border-radius: 5px;
        margin-bottom: 20px;
        .el-form-item{
            margin: 0 !important;
        }
       
    }

    .sub-btn {
        margin-top: 20px;

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
            padding-top: 25px;
            .el-input__inner{
                border: none;
            }
        }
    }
    form.el-form.demo-ruleForm{
        width: 100%;
    }
</style>
