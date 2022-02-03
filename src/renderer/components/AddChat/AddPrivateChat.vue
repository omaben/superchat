<template>
<div class="add-chat-box">
    <div class="add-chat-mark"></div>
    <div class="add-chat-cent">
        <div class="add-chat-title">
            <div class="settting-close" @click="hideSetBox">
                <img  :src="require('@/assets/svg/closeModal.svg')" alt="">
            </div>
            <h2>{{$t('addNewContact')}}</h2>
            <!-- <div class="add-member-btn">
                <el-button type="primary" size="small" round>完成</el-button>
            </div> -->
        </div>
        <div class="search-member" :class="{'inSearchFouc':inSearchFouc || name}">
            <input type="text" class="seachbox" ref="seachbox" v-model="name" @focus="inSearchFouc=true" @blur="inSearchFouc = false" @input="findFriend" :placeholder="$t('searchForContactsInput')">
            <i class="el-icon-close clear" @click="clearSearch"></i>
        </div>
        <!-- <div class="add-friend">
            <div class="member-item" v-for="(item,index) in findFriendList" :key="index" v-show="findFriendList.length>0">
                <div class="avatar">
                    <div class="no-avatar"></div>
                </div>
                <div class="member-name">
                    <span>{{item&&item.nikeName}}</span>
                    <div>
                        <el-button class="add-btn" size="small" round  @click="selectItem(item)">添加</el-button>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="member-list">
            <div class="member-item" v-for="(item,index) in findFriendList" :key="index" v-show="findFriendList.length>0">
                <div class="avatar">
                    <img v-if="item.photo" :src="item.photo" alt="">
                    <div v-else class="no-avatar">
                        <div class="vname">
                            {{item.nikeName&&item.nikeName.slice(0,2)}}
                        </div>
                    </div>
                </div>
                <div class="member-name">
                    <span>{{item&&item.nikeName}}</span>
                    <div v-if="item.id!=userInfo.id && !friendActive">
                        <el-button class="add-btn" size="small" round  @click="selectItem(item)">{{$t('add')}}</el-button>
                    </div>
                    <div v-if="friendActive">
                        <el-button class="add-btn" size="small" round  @click="toChat(item)">{{$t('openChat')}}</el-button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {queryUserByAccount} from '@/services';
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            name: "",
            inSearchFouc: false,
            checked: false,
            findFriendList: [],
            friendActive: false
        }
    },
    mounted() {
        this.makeInpFocus();
        this.$bus.$on('addfriend_init',()=>{
            this.name = '';
            this.makeInpFocus();
            this.findFriendList = [];
        })

        

    },
    destroyed() {
        this.$bus.$off('addfriend_init')
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'friends'
        ]),
    },
    methods: {
        findFriend(){
            let post = {
                account: this.name
            }
            queryUserByAccount(post).then(res => {
                let dedata = res
                if(dedata.success){
                    this.findFriendList = (dedata.data&&dedata.data.User&&[dedata.data.User]) || [];
                    if(this.findFriendList.length>0){
                        var friend=this.friends.find(qry=> qry.id === this.findFriendList[0].id)
                        if(friend){
                            this.friendActive=true
                        }
                    }
                    
                }else{
                    this.findFriendList = []
                    this.$message.error(dedata.message)
                }
            })
        },
        makeInpFocus(){
            this.$refs.seachbox.focus()
        },

        hideSetBox() {
            this.$emit('hideSetBox')
        },
        clearSearch() {
            this.name = "";
            this.inSearchFouc = false;
            this.findFriendList = [];
            this.makeInpFocus();
        },
        toChat(item) {
            //if(this.chatActiveIdx==idx)return
            this.$store.dispatch('SetChatInfo', item);
            this.$store.dispatch('SetChatBox',true)
            this.$bus.$emit('changeChat', true);
            this.$store.commit('SET_EVAL', '')
            this.hideSetBox()
        },
        selectItem(item) {
            item.select = !item.select;
            this.$emit('addFriend',item)
        }
    },
}
</script>

<style lang="scss" scoped>
.add-chat-box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20000;
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
        width: 448px;
        height: 369px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        box-sizing: border-box;

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
                background: var(--primary-color);
                border: 0;
                outline: none;
                box-shadow: none;
                &:focus {
                    border: 0;
                    outline: none;
                    box-shadow: none
                }
                &::placeholder {
                    color: #fff;
                    opacity: 1; 
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
            height: calc(100% - 130px);
            overflow: auto;
            

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
                    width: 100px;
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
                        background: transparent;
                        color: var(--primary-color);
                        outline: none;
                        border: 1px solid var(--primary-color);
                    }
                }
            }

        }
        .add-friend{
            height: auto;
        }

    }

}
</style>
