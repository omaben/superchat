<template>
    <div>
        <!-- 弹出框展示 -->
        <el-dialog 
            title="" :visible.sync="isShowPic" class="showPics" @closed="closeDialog()">
            <!-- <img v-if="showStatus==1" src="~@/assets/404_images/404.png" alt=""> -->
            
            <div v-if="showStatus==2" class="video">
                <div class="video-player">
                    <d-player v-if="videoOptions.video" ref="player" :options="videoOptions" @play="play"></d-player>
                </div>
            </div>
            <div class="pre-slider slider-icon" @click="slide()" v-if="options.currentPage>0">
                    <i class="el-icon-arrow-left"></i>
            </div><!-- 
             <div class="button test" @click="slideTo(2)" v-if="options.currentPage>0">
                    <i class="el-icon-arrow-left"></i>
            </div> -->
            <div class="button downloadGallery" @click="downloadFile(currentElement.msg)">
                   <i class="icone el-icon-download"></i>{{$t('Download')}} 
            </div>
            <slider ref="slider" :options="options" @slide='getCurrent'  @init='init'>
                <!-- slideritem wrapped package with the components you need -->
                <slideritem v-for="(item,index) in someList" :key="index" :style="item.style"><img v-if="showStatus==1" :src="item.src" alt=""></slideritem>
                <!-- Customizable loading -->
            </slider>
            <div class="next-slider slider-icon" @click="slideNext()" v-if="options.currentPage<someList.length-1">
                    <i class="el-icon-arrow-right"></i>
            </div>
        </el-dialog>
        <!-- 房间 消息已读详情 -->
        <el-dialog 
            :title="$t('msgReadDetails')" :visible.sync="isShowReadInfo">

            <el-table v-if="gridData.readPersonCount" :data="gridData.readPerson">
                <el-table-column :label="$t('member')" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="avatars">
                            <img :src="scope.row.photo" alt="">
                            <p> {{scope.row.nikeName}} </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="address" :label="$t('isRead')" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="'success'" disable-transitions>{{$t('readed')}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="date" :label="$t('date')" align="center" width="200">
                    <template slot-scope="scope">
                        {{scope.row.readedTime | filterDate('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="gridData.notReadPersonCount" :data="gridData.notReadPerson">
                <el-table-column property="nikeName" :label="$t('member')" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="avatars">
                            <img :src="scope.row.photo" alt="">
                            <p> {{scope.row.nikeName}} </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="address" :label="$t('isRead')" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="'danger'" disable-transitions>{{$t('unRead')}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('date')" align="center" width="200">
                    <template slot-scope="scope">
                        -
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="!gridData.notReadPersonCount&&!gridData.readPersonCount" :data="[]">
                <el-table-column :label="$t('member')" align="center" width="200"></el-table-column>
                <el-table-column :label="$t('isRead')" align="center" width="200"></el-table-column>
                <el-table-column :label="$t('date')" align="center" width="200"></el-table-column>
            </el-table>

            
        </el-dialog>

    </div>
</template>

<script>
import VueDPlayer from "vue-dplayer"
import "vue-dplayer/dist/vue-dplayer.css"
import { imMsgReadInfo } from "@/services";
import { slider, slideritem } from 'vue-concise-slider'
import MSG_TYPE,{translateHTML} from "@/services/im/constant" //调试用
import {
	chatInRoomsDAO,
	chatLocalMsgDAO
} from "@/services/db";
export default {
    components: {
        "d-player": VueDPlayer,
        slider,
      slideritem
    },
    computed: {
        player() {
            return this.$refs.player.dp;
        }
    },
    data() {
        return {
            MSG_TYPE,
            someList:[
                
            ],
            currentElement:[],
        //Slider configuration [obj]
        options: {
          currentPage: 5
        },
            isShowPic: false,
            videoOptions: {
                video:{}
            },
            showStatus: -1,
            picUrls: '',
            isShowReadInfo: false,
            gridData: {},

        }
    },
    updated() {
        this.$bus.$off('imgList')
        this.$bus.$on('imgList',(data) => {
            this.someList=[]
            /* let getInstance = chatLocalMsgDAO.getInstance();
            getInstance.findByRoomIdAndId(data).toArray().then(result=>{
                
                this.showStatus = status;
                let picture={}
                result.map(qry => {
                    
                    if(qry.msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE || (qry.quoteMsg && JSON.parse(qry.quoteMsg).msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE)){
                        let element = qry
                        if(!element.quoteMsg){
                            if(JSON.parse(element.msg).url){
                                picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(element.msg).url
                                }
                            }else{
                            picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(element.msg).picUrl
                                } 
                            }
                        }else{
                            let MsgQuote=JSON.parse(element.quoteMsg)
                            if(JSON.parse(MsgQuote.msg).url){
                                picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(MsgQuote.msg).url
                                }
                            }else{
                            picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(MsgQuote.msg).picUrl
                                } 
                            }
                        }
                        var elm=this.someList.find(qry=>qry.msgId===picture.msgId)
                        if(!elm){
                            this.someList.push(picture)
                        }

                    }
                });
            }) */
        })
    },
    mounted() {
        this.$bus.$off('dialog_show')
        this.$bus.$off('imgList')
        this.$bus.$on('imgList',(data) => {
            this.someList=[]
            let getInstance = chatLocalMsgDAO.getInstance();
            /* getInstance.findByRoomIdAndId(data).toArray().then(result=>{
                
                this.showStatus = status;
                let picture={}
                result.map(qry => {
                    
                    if(qry.msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE || (qry.quoteMsg && JSON.parse(qry.quoteMsg).msgType==MSG_TYPE.IM_MSG_TYPE_PICTURE)){
                        let element = qry
                        if(!element.quoteMsg){
                            if(JSON.parse(element.msg).url){
                                picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(element.msg).url
                                }
                            }else{
                            picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(element.msg).picUrl
                                } 
                            }
                        }else{
                            let MsgQuote=JSON.parse(element.quoteMsg)
                            if(JSON.parse(MsgQuote.msg).url){
                                picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(MsgQuote.msg).url
                                }
                            }else{
                            picture={
                                    msgId:element.msgId,
                                    src:JSON.parse(MsgQuote.msg).picUrl
                                } 
                            }
                        }
                        var elm=this.someList.find(qry=>qry.msgId===picture.msgId)
                        if(!elm){
                            this.someList.push(picture)
                        }

                    }
                });
            }) */
        })
       
        this.$bus.$on('dialog_show', (status,data) => {
            this.currentElement=data
            this.makeData(status,data)
            
            this.sliderGallery()
            
        })
        this.$bus.$off('show_dialog_err')
        this.$bus.$on('show_dialog_err', (data) => {
            this.$message.error(data)
        })
        // 
        this.$bus.$off('dialog_read_info')
        this.$bus.$on('dialog_read_info', (data) => {
            this.showReadInfo(data)
        })


    },
    methods: {
        init (data) {
            
        },
        downloadFile(msg){
            let { picUrl,url,fileName } = msg
            if(!fileName){
                fileName=this.$t('appName')+this.filterDate(parseInt(new Date().getTime()))+'.jpeg'
            }
            this.downloadUrlFile(picUrl||url, fileName)
        },
        downloadUrlFile(url, fileName) {
            const url2 = url.replace(/\\/g, '/');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url2, true);
            xhr.responseType = 'blob';
            //xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
            // 为了避免大文件影响用户体验，建议加loading
            xhr.onload = () => {
                if (xhr.status === 200) {
                    // 获取文件blob数据并保存
                    this.saveAs(xhr.response, fileName);
                }
            };
            xhr.send();
        },
        saveAs(data, name) {
            const urlObject = window.URL || window.webkitURL || window;
            const export_blob = new Blob([data]);
            const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            save_link.click();
        },
        getCurrent(data){
            this.options.currentPage=data.currentPage
        },
        slideTo (num) {
            this.$refs.slider.$emit('slideTo', num)
        },
        slideNext () {
            this.$refs.slider.$emit('slideNext')
            
        },
        slide () {
            this.$refs.slider.$emit('slidePre')
        },
        closeDialog(){
            if(this.showStatus==2){
                this.player.pause();
            }
                
        },
        showReadInfo(data){
            let post = {
                msgId: data.msgId,
                roomId: data.roomId,
            }
            imMsgReadInfo(post).then(res => {
                if(res.success){
                    let rdata = res.data;
                    this.gridData = rdata;
                    this.isShowReadInfo = true;
                }else{
                    // this.gridData = {
                    //     readPerson: [],
                    //     readPersonCount: 0,
                    //     notReadPerson: [],
                    //     notReadPersonCount: 0
                    // }
                    this.$message.error(res.message)
                }
            })

        },
        play() {
			this.player.play();
		},
        sliderGallery(status,data){
            let IndexList = this.someList.findIndex(element=>element.msgId==this.currentElement.msgId)
            this.options.currentPage=IndexList
            let that = this
            setTimeout(function(){
                that.slideTo(that.options.currentPage)
            },300)
            this.$emit('noScroll')
        },
        makeData(status,data){
            this.showStatus = status;
            let msgObj = data;
            if(status==1){
                this.picUrls = msgObj.isLocal?(msgObj.msg.picUrl ||msgObj.msg.url): (msgObj.msg.picUrl ||msgObj.msg.url)
            }else if(status==2){
                this.videoOptions = {
                    video: {
                        url: msgObj.msg.picUrl || msgObj.msg.url,
                        pic: msgObj.msg.littlePicUrl || msgObj.msg.thumbUrl,
                        thumbnails: msgObj.msg.littlePicUrl || msgObj.msg.thumbUrl
                    }
                };
                // 视频切换 重要！！！！！！
                setTimeout(()=>{
                    this.player.switchVideo({
                        url: msgObj.msg.picUrl || msgObj.msg.url
                    })
                    this.player.play();
                },100)
            }
            this.isShowPic = true;
        }
    },

}
</script>

<style lang="scss" scoped>

.showPics{
    img{
        //width: 100%;
        height: 500px;
        max-width: 100%;
    }
    .video-player {
        width: 100%;
        height: 100%;
        /* position: absolute; */
        /* top: 0; */
        background: #fafafa;
        /deep/ .dplayer {
            /* top: 50%; */
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 400px;
            /* height: px2rem(800); */
            /* transform: translateY(-50%); */
        }
    }
}
.avatars{
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        /* border: 1px solid red; */
    }
    p{
        margin-left: 10px;
    }
}


.button.downloadGallery {
    position: absolute;
    top: 13px;
    right: 25px;
    color: #fff;
    background: grey;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    i {
        margin-right: 6px;
    }
}

</style>