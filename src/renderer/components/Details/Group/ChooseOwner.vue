<template>
    <div>
        <div class="top-info-group">
                    <div class="search-box" :class="{'inSearchFouc':inSearchFouc || name}">
                        <img :src="require('@/assets/svg/search.svg')" alt="">
                        <input type="text" v-model="name" @input="filterName" @focus="inSearchFouc=true" @blur="inSearchFouc=false" ref="inputName" :placeholder="$t('search')"  />
                    </div>
                    <div class="select-member">
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
                    <h6>{{groupObj.holdtxt}}</h6>
                    
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
                                <span class="role" :class="{'green':item.role===2}">{{item.role | filterRole}}</span>

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
        props: ["groupObj","oldSelectMemberList",'friends'],
    
        components: {
            
        },
        data() {
            return {
                inSearchFouc: false,
                name: "",
                selectMemberList:this.oldSelectMemberList,
                selList:[],
            }
        },
        mounted() {

            
            this.$bus.$off('hideOwnerTransfer')
            this.$bus.$on('hideOwnerTransfer', () => {
                this.selectMemberList = []
                this.selList.map(element => {
                    element.select = false;
                });
                console.log('eee')
            })
            
            setTimeout(() => {
                this.filterName()
            }, 300);
        },
        updated() {
            this.$bus.$off('hideOwnerTransfer')
            this.$bus.$on('hideOwnerTransfer', () => {
                this.selectMemberList = []
                this.selList.map(element => {
                    element.select = false;
                });
            })
        },
        methods: {
            
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
                        
                        this.selList = []
                        let element = this.friends.find(qry => qry.role === 3)
                        element.select = true
                        this.selList = this.friends
                        this.$forceUpdate()
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
           
        }
    }
</script>
<style lang="scss" scoped>
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
</style>