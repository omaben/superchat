<template>
    <div class="add-chat-box">
        <div class="add-chat-mark"></div>
        <div class="add-chat-cent">
            <div class="add-chat-title">
                <div class="settting-close" @click="hideSetBox">
                    <i class="el-icon-back"></i>
                </div>
                <h2>{{groupObj.title}}</h2>
                <div class="add-member-btn">
                    <el-button :disabled="selectMemberList.length==0" @click="ownerTransfer" type="primary" size="small" round>{{groupObj.okText}}</el-button>
                </div>
            </div>
            <div class="search-member" :class="{'inSearchFouc':inSearchFouc || name}">
                <input type="text" v-model="name" @input="filterName" @focus="inSearchFouc=true" @blur="inSearchFouc=false" ref="inputName" :placeholder="groupObj.placeholder">
                <i class="el-icon-close clear" @click="clearSearch"></i>
            </div>
            
            <div class="member-list">
                <h6>{{groupObj.holdtxt}}</h6>
                <div class="member-item" @click="selectItem(item)" v-for="(item,index) in selList" :key="index">
                    <div class="avatar">
                        <img v-if="item.photo" :src="item.photo" alt="">
                        <div class="vname" v-else>
                            {{item.nikeName&&item.nikeName.slice(0,2)}}
                            
                        </div>
                        
                    </div>
                    <div class="member-name">
                        <p><span style="width:initial">{{item.nikeName||item.nickName}} </span><span v-if="item.role!=1" style="width:initial"> ({{item.role | filterRole}})</span></p>
                        <div class="member-checkbox" :class="{'select':item.select}">
                            <i class="el-icon-check" v-if="item.select"></i>
                        </div>
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
        selectList: {
			type: Array,
			default: () => {
				return []
			}
        },
        title: {
            type: String,
			default: ""
        },
		okText: {
			type: String,
			default: ""
		},
		placeholder:{
			type: String,
			default: ""
        },
        holdtxt: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            name: "",
            inSearchFouc: false,
            checked: false,
            selectMemberList: [],
            selList: [],
            selectListPro: [],
            groupObj:{
                title: '',
                okText: '',
                placeholder: '',
                holdtxt: '',
            }

        }
    },
    computed: {
        ...mapGetters([
            'chatMembers',
        ])
    },
    updated() {
        this.$refs.inputNames&&this.$refs.inputNames.focus()
    },
    mounted() {
        this.dealProps() // 这样写原因是因为$t is not a function 
        this.$refs.inputName.focus();
        this.selectList.map(v => {
            v.select = false
        })
        this.selList = [...this.selectList]
        /* let memIds = []
        this.chatMembers.map(v => {
            memIds.push(v.id)
        })
        this.selList = this.selList.filter(v => !memIds.includes(v.id)) */
        this.selectListPro = this.selList

    },
    methods: {
        dealProps(){
            let title,okText,placeholder,holdtxt
            title = this.title
            okText = this.okText
            placeholder = this.placeholder
            holdtxt = this.holdtxt
            if(!title){
                title = this.$t('newGroupChat')
            }
            if(!okText){
                okText = this.$t('complete')
            }
            if(!placeholder){
                placeholder = this.$t('searchForContacts')
            }
            if(!holdtxt){
                holdtxt = this.$t('suggest')
            }
            this.$set(this.groupObj,'title',title)
            this.$set(this.groupObj,'okText',okText)
            this.$set(this.groupObj,'placeholder',placeholder)
            this.$set(this.groupObj,'holdtxt',holdtxt)
        },
        filterName(){
            if(this.name){
                this.selList = this.selectListPro.filter(v => v.nikeName.toLowerCase().indexOf(this.name.toLowerCase())>-1) || []
                if(this.selList.length==0){
                    this.selList = this.selectListPro.filter(v => v.uid.indexOf(this.name)>-1)
                }
                
            }else{
                this.selList = this.selectListPro
            }
        },
        ownerTransfer(){
            this.$emit('selectedItem',this.selectMemberList)
        },
        hideSetBox() {
            this.$emit('back', true)
        },
        clearSearch() {
            this.name = "";
            this.inSearchFouc = false;
            this.filterName()
        },
        selectItem(item) {
            this.selectMemberList = []
            var elems = document.querySelectorAll(".member-checkbox");
                    [].forEach.call(elems, function(el) {
                            el.classList.remove("select");
                    });
            this.selList.forEach(itemselect => {
                if(itemselect.id != item.id){
                    itemselect.select = false
                }
            })
            item.select = !item.select;
            if (item.select) {
                this.selectMemberList.push(item);

            } else {
                for (let index = 0; index < this.selectMemberList.length; index++) {
                    const element = this.selectMemberList[index];
                    if (element.id == item.id) {
                        this.selectMemberList.splice(index, 1);
                        break;
                    }

                }

            }

        },
        unSelectItem(item, idx) {

            this.selList.map(element => {
                if (element.id == item.id) {
                    element.select = false;
                    this.selectMemberList.splice(idx, 1);
                }
            });

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

            input {
                padding: 0 75px 0 25px;
                box-sizing: border-box;
                font-size: 16px;
                color: #fff;
                width: 100%;
                height: 60px;
                background: transparent;
                border: none;
                outline: none;
            }

            .clear {
                display: none;
                position: absolute;
                right: 20px;
                top: 17px;
                font-size: 24px;
                cursor: pointer;
            }

            /* &.inSearchFouc { */
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

            /* } */
        }

        .select-member {
            margin: 10px 0;
            width: 100%;
            overflow: auto;
            word-break: keep-all;
            white-space: nowrap;
            cursor: pointer;

            .select-item {
                display: inline-block;
                text-align: center;
                margin-right: 10px;

                &:first-child {
                    margin-left: 10px;
                }

                .avatar {
                    position: relative;
                    display: inline-block;
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    margin-bottom: 10px;
                    .vname{
                        width: 65px;
                        height: 65px;
                        font-size: 35px;
                        color: var(--primary-color);
                        border-radius: 50%;
                        background: #e5e4e8;
                        text-align: center;
                        line-height: 65px;
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
                    width: 65px;
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: keep-all;

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
                    flex: 1;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #ddd;

                    span {
                        display: inline-block;
                        width: 300px;
                        overflow: hidden;
                        word-break: keep-all;
                        text-overflow: ellipsis;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .member-checkbox {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translate(0, -50%);
                        width: 25px;
                        height: 25px;
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

    }

}
</style>
