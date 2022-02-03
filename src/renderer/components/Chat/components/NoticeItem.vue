<template>
<!-- 通知列表 -->
<!--  (item.roomType===MSG_TYPE.RECEIVE_TYPE_PRIVATE || (item.roomType===MSG_TYPE.RECEIVE_TYPE_PUBLIC && ((chatInfo.showRoomNotice!=1 || item.msg.noticeType != MSG_TYPE.ROOM_KICK_USER) && (chatInfo.showMuteNotice!=1 || item.msg.noticeType != MSG_TYPE.ROOM_MUTE_USER)) || chatInfo.groupRole != 1)) -->
    <div class="notice-item" v-if="chatInfo.showRoomNotice!=1 && item.roomType===MSG_TYPE.RECEIVE_TYPE_PUBLIC ">
        <!-- <div class="msg-tips" v-if="noticeMsg.isTips">
            <div>
                <span class="active">{{noticeMsg.controUser.nikeName}}</span> {{noticeMsg.message}}
            </div>
        </div> -->
        <div class="msg-tips">
            <div>
                <span class="active" v-html='handleNotice(noticeMsg)'></span>
                <!-- <span class="active">{{noticeMsg.message}}</span> -->
            </div>
            <!-- <div>
                <span class="active">{{noticeMsg.message}}</span>
            </div> -->
        </div>

    </div>
</template>

<script>
// import MSG_TYPE from "@/services/im/constant";
import MSG_TYPE,{handleNotice} from "../../../../renderer/services/im/constant";
import {
    mapGetters
} from 'vuex'
export default {
    props: ["item"],
    computed: {
        ...mapGetters([
            'chatInfo',
        ]),
        
    },
    data() {
        return {
            MSG_TYPE,
            noticeMsg: {},
            noticeType: this.item.msg.noticeType,
        }
    },
    watch: {
        item(val){
            if(val){
                this.setNotice()
            }
        }
    },
    mounted() {
        this.setNotice()
    },
    methods: {
        handleNotice,
        setNotice(){
            

            this.noticeMsg = {
                ...this.item,
                ...this.item.msg,
                isTips: this.noticeType===MSG_TYPE.ROOM_KICK_USER || this.noticeType===MSG_TYPE.ROOM_ADD_USER
            };
        },

    },
}
</script>

<style lang="scss" scoped>
.notice-item{
    /* tips 提示 */
    padding-top: 5px;
    .msg-tips{
        text-align: center;
        width: 100%;
        font-size: 14px;
        color: #999DA0;
        margin-top: 5px;
        margin-bottom: 5px;
        line-height: 14px;
        .active{
            color: #999DA0;
        }
    }
}
</style>