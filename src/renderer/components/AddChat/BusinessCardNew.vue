<template>
    <div class="chat-box share-contact">
                <div class="chat-item">
                    <div class="chat-title">
                        <div class="add-chat-title">
                            <div class="settting-close" @click="hideBusinessCard">
                                <i class="el-icon-arrow-left" ></i> {{$t('back')}}
                            </div>
                            <h2>{{$t('share_contact')}}</h2>
                            <div class="add-member-btn">
                                <el-button type="primary" size="small"  round @click="sendBusinessCard" :disabled='selectMemberList.length === 0'>{{$t('share')}}</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="top-info-group">
                    <div class="search-box" :class="{'inSearchFouc':inSearchFouc || name}">
                        <img :src="require('@/assets/svg/search.svg')" alt="">
                        <input type="text" v-model="name" @input="filterName" @focus="inSearchFouc=true" @blur="inSearchFouc=false" ref="inputName" :placeholder="$t('search')" />
                    </div>
                    <div class="select-member" v-if="selectMemberList.length>0">
                        <div class="select-item" @click="unSelectItem(item,index)" v-for="(item,index) in selectMemberList" :key="index">
                            <div class="avatar">
                                <img v-if="item.photo" :src="item.photo" alt="">
                                <div class="vname" v-else>
                                    {{item.nikeName&&item.nikeName.slice(0,2)}}
                                </div>
                            </div>
                            <div class="member-name">
                                <span>{{item.nikeName}}</span>
                                <img :src="require('@/assets/svg/unselect-member.svg')" alt="">
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="member-list" :class="{'has-select':selectMemberList.length > 0}">
                    
                    <div class="member-item" @click="selectItem(item)" v-for="(item,index) in selList" v-show="!item.select" :key="index">
                        <div class="avatar">
                            <img v-if="item.photo" :src="item.photo" alt="">
                            <div class="vname" v-else>
                                {{item.nikeName&&item.nikeName.slice(0,2)}}
                            </div>
                        </div>
                        <div class="member-name">
                            <p>
                                {{item.nikeName||item.nickName}}
                            </p>

                            <div class="member-checkbox" :class="{'select':item.select}">
                                <i class="el-icon-check" v-if="item.select"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
    </div>
</template>
<script>
    import {  mapGetters } from 'vuex'

    export default {
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
                'friends',
            ]),
            
        },
    
        components: {
            
        },
        data() {
            return {
                inSearchFouc: false,
                name: "",
                selectMemberList:[],
                selList:[],
            }
        },
        mounted() {
            this.filterName()
        },
        updated() {
            
        },
        methods: {
            hideBusinessCard(){
                this.selectMemberList = []
                this.$emit('hideBusinessCard', false)
            },
            selectItem(item) {
                item.select = !item.select;
                    this.selectMemberList = []
                    this.selList.map(element => {
                        if(element.id != item.id){
                            element.select = false;
                        }
                    });
                    this.selectMemberList.push(item);
                this.$emit('selectItem', this.selectMemberList)
            },
            unSelectItem(item, idx) {

                this.selList.map(element => {
                    if (element.id == item.id) {
                        element.select = false;
                        this.selectMemberList.splice(idx, 1);
                    }
                });
                this.$emit('selectItem', this.selectMemberList)

            },
            filterName(data){
                        if(this.name){
                            this.selList = this.friends.filter(v => v.nikeName.toLowerCase().indexOf(this.name.toLowerCase())>-1) || []
                            if(this.selList.length==0){
                                this.selList = this.friends.filter(v => v.uid.indexOf(this.name)>-1)
                            }
                        }else{
                            this.selList = this.friends
                        }
            },
            clearSearch() {
                this.name = "";
                this.inSearchFouc = false;
                this.filterName()
            },
            sendBusinessCard(){
                this.$emit('sendBusinessCard',this.selectMemberList[0])
                this.hideBusinessCard()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .share-contact{
        position: fixed;
        z-index: 10000;
        top: 0;
        background: #fff;
        left: 9.5cm;
        width: calc(100% - 9.5cm);
        height: 100vh;

        .select-member {
            margin:  0;
            width: 100%;
            display: inline-flex;
            cursor: pointer;

            .select-item {
                display: inline-flex;
                text-align: center;
                margin-right: 10px;
                margin-left: -24px;
                margin-bottom: 10px;
                /* &:first-child {
                    margin-left: 10px;
                } */

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-bottom: 0;
                    position: relative;
                    right: -26px;
                    z-index: 1;
                    border: 2px solid #fff;
                    .vname{
                        width: 100%;
                        height: 100%;
                        font-size: 14px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 38px;
                    }

                    .no-avatar,img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f0f0f0;
                    }

                    .select-close {
                        position: absolute;
                        right: 0;
                        top: 0;
                        z-index: 1;
                        font-size: 22px;
                        color: #317ace;
                        border-radius: 50%;

                        &::before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 0;
                            width: 24px;
                            height: 24px;
                            background: #fff;
                            border-radius: 50%;

                        }

                        i {
                            position: relative;
                        }

                    }
                }

                .member-name {
                    max-width: 176px;
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: keep-all;
                    display: inline-block;
                    background: #F0F3F4;
                    text-align: left;
                    padding: 12px;
                    padding-right: 30px;
                    border-radius: 17px;
                    min-width: 130px;
                    position: relative;
                    padding-left: 31px;
                    
                    img{
                        position: absolute;
                        right: 8px;
                        top: 11px;
                        cursor: pointer;
                    }

                }
            }

        }

        .member-list {
            height: calc(100% - 140px);
            overflow: auto;

            &.has-select {
                height: calc(100% - 220px);
            }

            h6 {
                margin: 10px;
                font-size: 12px;
                color: #999;
            }

            .member-item {
                padding: 3px 10px;
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
                    flex: 1;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ddd;
                    
                    p {
                        display: inline-block;
                        width: 300px;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        font-size: 18px;
                        font-weight: bold;
                        span.role {
                            color: var(--primary-color);
                            font-size: 14px;
                            position: relative;
                            top: 0;
                            background: #F0F3F4;
                            padding: 4px 11px;
                            line-height: initial;
                            border-radius: 13px;
                            &.green{
                                color: #00D94B;
                            }
                        }
                    }

                    .member-checkbox {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translate(0, -50%);
                        width: 20px;
                        height: 20px;
                        border: 1px solid #ddd;
                        border-radius: 50%;
                        
                        &.select {
                            border: 0;
                            background: linear-gradient(45deg, #317ace, #52baed);
                            text-align: center;
                            line-height: 25px;
                            font-size: 18px;
                            color: #fff;
                        }

                    }
                }
            }

        }

        .top-info-group{
            padding: 15px;
            padding-top: 25px;
            border-bottom: 1px solid #F0F3F4;
            .search-box {
                            height: 37px;
                            border: none;
                            border-radius: 25px;
                            background: #F0F3F4;
                            cursor: pointer;
                            display: flex;
                            padding: 0 10px;
                            box-sizing: border-box;
                            align-items: center;
                            width: 100%;
                                margin-bottom: 10px;

                            img {
                                width: 10px;
                                height: 10px;
                                margin-right: 6px;
                            }

                            input {
                                width: 100%;
                                height: 100%;
                                font-size: 12px;
                                border: 0;
                                background: transparent;
                                cursor: pointer;
                                border-radius: 10px;
                                outline: none !important;
                            }
            }
        }

    }
    .chat-box {
        
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

        }
    }
</style>