<template>
    <div class="chat-boxs" :style="{'height': inputHeight+'px'}" :class="{'keypressMsg':keypressMsg}" v-click-outside="hideMinj">
        <div class="send-input" :class="{'showDialogImo':showDialog||quotaActive}">
            
            <div class="send-tool-item" @click="toogleDialogEmoji" :class="{'send-nouse':isDisabled}">
                <svg-icon icon-class="biaoqing"></svg-icon>
            </div>

            <!-- <input :disabled="isDisabled" type="text" class="editor" v-model="eValData" :placeholder="placeholder" @keyup.enter="sendMsgs"  @input='checkMembers'> -->
            <div class='members-groups'>
                <el-drawer
                    :visible.sync="drawer"
                    direction="btt"
                    >
                    <ul class="member-in-group">
                        <li v-for ='(item,index) in chatMembersFilter' :key='index' @click='addUser(item)'>
                            <el-avatar v-if="item.photo" :src="item.photo"></el-avatar>
                            <el-avatar  v-else>{{item.nikeName && item.nikeName.slice(0,2)}}</el-avatar>
                            <p>{{item.nikeName}}</p>                           
                        </li>
                    </ul>
                </el-drawer>
            </div>
              <!-- <editor
       api-key="no-api-key"
       :init="{
         height: 50,
         menubar: false,
         plugins: [],
         toolbar:''
       }"
     /> -->
     <!-- <div >{{eValData}}</div> -->
     <textarea   v-model="eValData" id="editor"   @input='showAt'></textarea>
            <!-- <HighlightableInput
                highlight-style="background-color:yellow" 
                :highlight-enabled="highlightEnabled" 
                :highlight="highlight" 
                v-model="eValData"
                @input='checkMembers'
                ref="editor"
                id='editor'
                class="editor"
                :disabled="isDisabled"
                v-show="!startRecord"
                /> -->
            <div class="timer-send" v-show="startRecord">{{recordTimeM}}:{{recordTimeS}} </div>
            <i class="el-icon-close delete-voice-after" @click="cancelRecord" v-show="activeRecord"></i>
            <div class="audio-container" v-show="activeRecord">
                <audio :src="record" controls controlsList="nodownload" />
            <!--  <mini-audio v-if="record!=''" :audio-source="record"></mini-audio> -->
            </div>
            <div class="sendIcon"   @click="sendFunc">
                
                <svg-icon icon-class="fasong"></svg-icon>
            </div>



            <div v-show="showDialog&&!isDisabled"  class="im-emoji" :class="{'quotaActive':quotaActive}">
                <div>
                    <el-button-group>
                        <el-button :class="{'active':showMineji}" type="primary" plain @click="showji(1)">{{$t('emoticons')}}</el-button>
                        <el-button :class="{'active':showCusji}" type="primary" plain @click="showji(2)">{{$t('customEmoji')}}</el-button>
                    </el-button-group>
                </div>
                <picker set='apple' @select="onSelectEmoji" :i18n= "{search:''}" v-show="showMineji" />
                <div v-show="showCusji" class="im-cusmoji">
            
                    <el-upload
                        action=""
                        list-type="picture-card"
                        :file-list="fileList"
                        :on-preview="handlePictureCardPreview"
                        :http-request="handleChange"
                        :before-upload="beforeUpload"
                        :on-exceed="onExceed"
                        ref="dynamic"
                        class="dynamic"
                        >
                        <i slot="default" class="el-icon-plus"></i>
                        <!-- 自定义图片强 -->
                        <!-- <div slot="file" slot-scope="{file}">
                            <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url" alt=""
                            >
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleDownload(file)"
                                >
                                    <i class="el-icon-download"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                >
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div> -->
                    </el-upload>
                    <ul ref="customRef" class="el-upload-list el-upload-list--picture-card dis-block">
                        <li v-for="(item,index) in fileListPro" :key="item.uid" class="el-upload-list__item is-success">
                            <img :src="item.url" alt="" :index="index" class="el-upload-list__item-thumbnail" @click.stop="sendCusFace(item.id)">
                        </li>
                    </ul>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>
            </div>
            
           <span></span>
        </div>
        <div class="im-upfiles">
            <choose-file
                ref="chooseFile"
                :isShow="isShowFile&&!isDisabled"
                :isUploadImg="isUploadImg"
                :isUploadVideo="isUploadVideo"
                @cancelRecord='cancelRecord'
                @choose-file="chooseFile"
                @recordClick="recordClick"
                @stopRecord="stopRecord"
                @sendRecord="sendRecord"
                @sendBusinessCard="sendBusinessCard"
                
            />
        </div>
        <div class="copy-img" v-if="showCopyImg" @click="hideCopyImg">
            <div class="copy-img-box">
                    <img :src="copyImgUrl" alt="">

                     <div class="sendIcon"   @click="sendFCopyImg">
                
                <svg-icon icon-class="fasong"></svg-icon>
            </div>

            </div>
         
        </div>
    </div>
</template>

<script>
import ChooseFile from "./ChooseFile";
import { pictureCol,delPictureCol,pictureColList,goimfilesUpload} from "@/services"
import MSG_TYPE from "@/services/im/constant" //调试用
import { mapGetters } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { Picker } from 'emoji-mart-vue'
import HighlightableInput from "vue-highlightable-input"
//  import Editor from '@tinymce/tinymce-vue'





export default {
    components: {
        ChooseFile,
        Picker,
        HighlightableInput
        // Editor
    },
    props: {
        keypressMsg: {
            type: Boolean,
            default: false
        },
        eMsg: {
            type: Boolean,
            default: false
        }, 
        quotaActive: {
            type: Boolean,
            default: false
        }, 
    },
    computed: {
        ...mapGetters([
            'chatInfo',
            'userInfo',
            'customFace',
            'roomsMemberObj',
            'usersObj',
            'eVal'
        ]),
        
        
    },
    beforeDestroy(){
       
    },
    directives: {
        ClickOutside
    },

    data() {
        return {
             msg: '',
            highlight: [
                "whatever",
            ],
            highlightEnabled: true,
            chatMembersFilter: [],
            chatMembers: [],
             drawer: false,
            iconConfig : {
                placement: 'top',
                size: '30px',
                name: 'fa-send', // font awesome icon name
                color: '#fff' // icon color: hex、rgb or rgba value
            },
            eValData:'', 
            startRecord:false,
            isShowFile: true,
            isUploadImg: true,
            isUploadVideo: true,
            isDisabled: false,
            placeholder: "",
            timerRecord:0,
            timer: null,
            muteTimes: -1,
            
            chatInfoPro: {},
             minutes : 0,
             seconds : 0,
             recordTimeS:null,
             recordTimeM:null,
            // 表情
            showDialog: false,
            inputHeight: "52",
            showMineji: true,
            showCusji: false,

            dialogImageUrl: '',
            dialogVisible: false,
            beFaild: false,
			url: '',
            // limit: 10,
            picture: '',
            imageUrl: '',
            fileList: [],
            fileListPro: [],
            fileData: {},
            imgIndex: -1,
            isClickedPop: false,
            keyMsg: this.$t('keyMsg'),
            record:'',
            activeRecord:false,
            event: '',
            atUserArr:[],
            ctrlDown:false,
            copyImgFile:"",
            copyImgUrl:"",
            showCopyImg:false
        }
    },
    updated() {
        console.log(this.eVal,'eVal')
        if(!this.eMsg){
            // this.eValData=this.eVal
        }
        this.$bus.$off('inputText')
        this.$bus.$on('inputText',() => {
            this.eValData=''
        })
        var el = document.getElementById("editor");
        let that = this
        el.addEventListener("keydown", function(event) {
            that.event = event
            that.handleKeyCode()
         },{once:true});
        // el.addEventListener("keyup", function(event) {
        //     that.KeyupCode(event)
        //  });

        el.addEventListener('paste', function (event) {
            var items = event.clipboardData && event.clipboardData.items;
            var file = null;
            // console.log(event.clipboardData.getData('text'))
            // let copyMsg = event.clipboardData.getData('text');
            // if (copyMsg.indexOf('thumbUrl') !== -1) {
            //     console.log(JSON.parse(copyMsg),'copyMsg');
            //     that.eValData = "";
            //     el.value ="";

            // }

        console.log(items.length)
        if (items && items.length) {
                // 检索剪切板items
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        file = items[i].getAsFile();
                        that.copyImgFile = file;
                        console.log(file)
                        that.copyImgUrl =  window.webkitURL.createObjectURL(file) ;
                        that.showCopyImg = true;
                         window.getSelection().removeAllRanges();
                        break;
                    }
                }
            }


          
            // 此时file就是剪切板中的图片文件
        },{once:true});

       // this.$refs.editor.focus()
       //el.off()
        //this.keyMsg=false
    },
    mounted() {
       // this.$refs.editor.focus()
       this.getAllMembers()
        this.doEmit()
        this.getPicList()
        this.rightPoint()
        
        //this.eMsg()
    },
    methods: {
      

        addUser(item){
            let nameMemberStart = this.eValData.split('@').pop()
            let nickname
            if(nameMemberStart){
                nickname = item.nikeName.split(nameMemberStart).pop()
            }else{
                nickname = item.nikeName
            }
            this.eValData+=nickname +' ';
            this.atUserArr.push(nickname)
            this.drawer = false
        },
        async getAllMembers(){
                console.log(this.chatInfo.roomType )
                // If it is roomType == 1, do not execute fixInfo()
                if(this.chatInfo.roomType != 1){
                    let roomInfo = await this.fixInfo(2, {
                    roomIds: [this.chatInfo.roomId | this.chatInfo.id],
                    
                    }).catch((err) => {
                        
                        this.$bus.$emit("show_dialog_err", err);
                    });
                    if (roomInfo) {
                        
                        let info = { ...this.chatInfo, ...roomInfo};
                        await this.roomListInstance().editInstance(info)
                        let chatMembers = info.chatMember
                        this.$store.commit("SET_CHATMEMS", chatMembers); 
                        if(chatMembers&&chatMembers.length>0){
                            chatMembers.map(async(vt) => {
                                this.$store.commit('UPDATE_USERS_OBJ', vt)
                                await this.userListInstance().editInstance(vt)
                            })
                        }
                        this.chatMembers = chatMembers
                    }else{
                        if(!'roomId' in this.info){
                            return;
                        }
                        let roomId = this.info.roomId || this.info.id
                        let rooms = await roomListDao.getInstance().findByRoomId(roomId);
                        let chatMembers = rooms.chatMember
                        this.$store.commit("SET_CHATMEMS", chatMembers);
                        this.chatMembers = chatMembers
                        
                    }
                }
                
               
                this.chatMembersFilter = this.chatMembers
                this.chatMembers.forEach(qry=>{
                     this.highlight.push(
                          {text:"@"+qry.nikeName, style:"color:var(--primary-color)"}
                     )
                })
               
        },
        sendBusinessCard(friend){
            this.$emit("sendBusinessCard",friend)
        },
        recordClick(activeRecord,keypressMsg){
            this.activeRecord=activeRecord
            this.startRecord=true
            this.ResetInterval()
            this.timerRecord = setInterval(this.startTimer, 1000);
        },
        ResetInterval() {
            clearInterval(this.timerRecord);
            this.seconds=0
            this.minutes=0
            this.recordTimeS = "00";
            this.recordTimeM = "00";
            
        },
        startTimer () {
            
            this.seconds++; 
            if(this.minutes == 0){
                this.recordTimeM="00" 
            }
            if(this.seconds < 9){
            this.recordTimeS = "0" + this.seconds;
            }
            
            if (this.seconds > 9){
            this.recordTimeS = this.seconds;
            
            } 
            
            if (this.seconds > 59) {
            this.minutes++;
            this.recordTimeM = "0" + this.minutes;
            this.seconds = 0;
            this.recordTimeS = "0" + 0;
            }
            
            if (this.minutes > 9){
            this.recordTimeM = this.minutes;
            }
        
        },
        hideMinj(){
            if(this.isDisabled)return
            this.isShowFile = true;
            this.showDialog=false
            //this.$emit('keypressMsgChange',false)
            //this.$bus.$emit("placeHeight", 80)
            
            this.$emit('moticClose',this.showDialog)
        },
        stopRecord(activeRecord,keypressMsg){
            this.activeRecord=activeRecord
            this.startRecord=false
            this.ResetInterval()
        },
        cancelRecord(){
            this.record=''
            this.activeRecord=false
            this.startRecord=false
            this.ResetInterval()
            this.$emit('keypressMsgChange',false)
        },
        sendRecord(data){
            this.activeRecord=true
            this.record=window.URL.createObjectURL(data)
            this.$emit('keypressMsgChange',true)
            //this.keypressMsg=true
            this.$emit("sendRecord",data,true)
        },
        sendFunc(){
            this.$emit('keypressMsgChange',false)
            //this.toogleDialogEmoji()
            this.sendMsgs()
           // this.$refs.editor.focus()
        },
        showAt(){
                 let isAt = this.eValData.charAt(this.eValData.length - 1) === '@';
                console.log(isAt);
                if(isAt){
                    this.drawer = true
                }else{
                     this.drawer = false
                }
        },
        // 键盘回车事件
       async  checkMembers(e){
           
            let that = this
            if(that.eValData === ''){
                that.chatMembersFilter = []
                that.drawer = false
            }
            console.log(that.eValData.charAt(that.eValData.length - 1) === '@','2131231')
            if(that.eValData.charAt(that.eValData.length - 1) === '@'){
                 that.drawer = true
                that.chatMembersFilter = that.chatMembers
            }
           else if(that.eValData.includes("@")){
                     that.drawer = false
                let nameMemberStart = that.eValData.split('@').pop()
                if(nameMemberStart){
                    let findIndex =  that.chatMembers.find(qry => qry.nikeName.startsWith(nameMemberStart))
                    if(!findIndex){
                        that.drawer = false
                    }
                    else{
                        let findIndexFind =  that.chatMembers.find(qry => qry.nikeName === nameMemberStart)
                        that.drawer = findIndexFind ? false : true
                        if(!findIndexFind){
                            that.chatMembersFilter = that.chatMembers.filter(qry => qry.nikeName.startsWith(nameMemberStart))
                        }else{
                            that.chatMembersFilter = that.chatMembers
                        }
                    }
                }
            }                        
        },
        // keyboard enter event
        handleKeyCode(){
               
                let that = this;
                
                this.$emit('keypressMsgChange',true)
                this.$emit('msgkeyChange',true)
                this.hideMinj()
                this.$bus.$emit('searchActiveUp', false);

                if(that.event.keyCode == 13){
                    this.sendMsgs();
                    this.$emit('keypressMsgChange',false)
                    that.drawer = false
                    //this.keypressMsg=false;
                    that.event.preventDefault();//禁止回车的默认换行
                }
                //this.keypressMsg=true;
                // if(that.event.keyCode == 13 && (that.event.ctrlKey||that.event.shiftKey)){
                //     this.eValData += "\n"
                // }else if(that.event.keyCode == 13){
                //     this.sendMsgs();
                //     this.$emit('keypressMsgChange',false)
                //     that.drawer = false
                //     //this.keypressMsg=false;
                //     that.event.preventDefault();//禁止回车的默认换行
                // }
                // if(that.event.keyCode == 8) {
                //     if(this.eValData.length<2 || this.eValData==""){
                //         this.$emit('keypressMsgChange',false)
                //         //this.keypressMsg=false;
                //     }
                //     let that = this
                //     setTimeout(function(){
                //         if(!that.eValData.includes("@")){
                //             that.drawer = false
                //         }
                //     },200)
                               
                // }
                if(that.event.keyCode==32 && (this.eValData==" " || this.eValData=='')){
                    this.eValData=""
                    this.$emit('keypressMsgChange',false)
                    this.$store.commit('SET_EVAL', '')
                }
                
                this.$store.commit('SET_EVAL', this.eValData) 


        },
     
        // 图片右键菜单
        // Picture right-click menu
        rightPoint(){
            let customRef = this.$refs.customRef
            let electron = this.$electron
            const {remote} = this.$electron
            const {Menu, MenuItem} = remote;
            //右键菜单
            //Right-click menu
            const menu = new Menu();
            let MenuList = [
                {
                    label: this.$t('preview'),
                    click: () => {
                        this.handlePictureCardPreview(this.imgIndex)
                    }
                },
                {type: 'separator'},
                {
                    label: this.$t('del'),
                    click: () => {
                        this.handleRemove(this.imgIndex)
                    }
                },
                // {label: '缩小', type: 'checkbox', checked: true},
            ]
            MenuList.map(v=> {
                v = new MenuItem(v)
                menu.append(v)
            })
            customRef.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                menu.popup({window: remote.getCurrentWindow()})
                this.imgIndex = e.target.getAttribute("index")
                // 标记右键事件 点击图片后设置为false 再做上传处理
                // Mark the right-click event and click on the picture and set it to false before uploading
                this.isClickedPop = true
            }, false)

        },
		onExceed() {
			this.$message.success(this.$t('最多上传10个文件'));
        },
        getPicList(){
            let post = {
                page: 1,
                pageSize: 150
            }
            pictureColList(post).then(res => {
                if(res.success){
                    this.fileListPro = res.data.data;
                    let count = res.data.count;
                    // 组装成face对象
                    // Assemble into a face object
                    this.makeArrFaceObj(this.fileListPro)

                }else{
                    if(this.userInfo&&this.userInfo.token){
                        this.$message.error(res.message)
                    }
                }
            })
        },
        makeArrFaceObj(arr){
            let faceObj = {};
            arr.map(data => {
                faceObj["id_"+data.id] = data;
            })
            this.$store.commit('SET_CUSTOM_FACE',faceObj)
        },
        async handleChange(params) {
            const { file } = params
            let form = new FormData();
            form.append("file", file);
            form.append("fileType", 1); // 1头像<不鉴权>  2消息内容
            form.append("isOneToOne", false); //false=群聊 true=私聊
            form.append("from", "");
            form.append("to", "");
            this.beFaild = false;
            let res = await goimfilesUpload(form)
            if(res.success){
                let data = res.data;
                // this.fileData = data;
                let post = {
                    ...data,
                    littlePicSizeWidth: data.width,
                    littlePicSizeHeight: data.height,
                    littlePicUrl: data.thumbUrl,
                    picSizeWidth: data.thumbWidth,
                    picSizeHeight: data.thumbHeight,
                    picUrl: data.url
                }
                //图片
                // let url = data.url
                pictureCol(post).then(result => {
				    if (result.success) {
                        if(!this.beFaild){
                            // this.$message.success('添加自定义表情成功');
                            this.$message.success(this.$t('doSucc'))
                            this.fileList = [];
                            this.getPicList();
                            let id = result.data.id;
                            this.makeFaceObj(data,file,id); //存入缓存及vuex
                        }
                    } else {
                        this.beFaild = true
                        this.$message.error(result.message);
                    }
                });
            }else {
                this.$message.error(res.message);
            }
        },
        makeFaceObj(data,file,id){
            let faceObj = {};
            //图片
            if (MSG_TYPE.REG_IMAGE.test(file.type)) {
                faceObj["id_"+id] = {
                    littlePicSizeWidth: data.width,
                    littlePicSizeHeight: data.height,
                    littlePicUrl: data.thumbUrl,
                    picSizeWidth: data.thumbWidth,
                    picSizeHeight: data.thumbHeight,
                    picUrl: data.url
                };
            }
            
            let faceObjs = {...this.customFace, ...faceObj}
            this.$store.commit('SET_CUSTOM_FACE',faceObjs)
        },
        delCusFaceLocal(id){
            let oldCusFaceObj = {...this.customFace}
            delete oldCusFaceObj["id_"+id]
            this.$store.commit('SET_CUSTOM_FACE',oldCusFaceObj)
        },
		beforeUpload(file) {
			const isJPG = file.type === 'image/jpeg' || file.type==='image/png' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isJPG) {
                this.$message.error(this.$t('uploadDesc1'));
                this.beFaild = true
                return false;
			}else if(!isLt2M) {
                this.$message.error(this.$t('uploadDesc2'));
                this.beFaild = true
                return false;
			}
            return true;
		},
        handleRemove(index) {
            let file = this.fileListPro[index]
            let post = {
                id: file.id
            }
            delPictureCol(post).then(res => {
                if(res.success){
                    // this.$message.success('移除成功！')
                    this.$message.success(this.$t('doSucc'))
                    this.getPicList()
                    this.delCusFaceLocal(file.id) // 去除本地自定义表情
                }else{
                    this.$message.error(res.message)
                }
            })
        },
        // 发送自定义表情
        // Send custom emoticons
        sendCusFace(idKey) {
            let faceObj = this.customFace['id_'+idKey]
            this.$bus.$emit('sendCusFace', faceObj)
        },
        handlePictureCardPreview(index) {
            this.dialogImageUrl = this.fileListPro[index].url;
            this.dialogVisible = true;
        },
        showji(status){
            if(status==1){
                this.showMineji = true
                this.showCusji = false
            }else if(status==2){
                this.showMineji = false
                this.showCusji = true
            }
        },
        toogleDialogEmoji() {
            
            if(this.isDisabled)return
            this.showDialog = !this.showDialog;
            this.isShowFile = !this.isShowFile;
            if(this.showDialog){
                //this.inputHeight = "518"
                //this.$bus.$emit("placeHeight", 518)
                this.showji(1)
                this.$emit('keypressMsgChange',true)
            }else{
                //this.inputHeight = "80"
                this.$emit('keypressMsgChange',false)
                this.$bus.$emit("placeHeight", 80)
            }

            this.$emit('motic',this.showDialog)
        },
        onSelectEmoji(emoji) {
           console.log( emoji.native)
            this.eValData += emoji.native;
            this.$store.commit('SET_EVAL', this.eValData)
           
        },
        chooseFile(file, localPath, status) {
			this.$emit("chooseFile", file, localPath, status);
		},
        sendMsgs(){
            console.log(this.eValData.trim(),'this.eValData.trim()');
            let usersId = ''
            let usersNickname = ''
            if(this.eValData!=' '){
                let result=this.eValData //.trim()
               var allName =this.atUserArr; //false// document.getElementById('editor').getElementsByTagName('span')
              
               if(allName){
                    allName.forEach((qry,index)=>{
                        let userNickname = allName[index]
                        let user = this.chatMembers.find(qry1=>qry1.nikeName === userNickname)
                        if(user){
                            if(usersId != '')
                            {
                                usersId+=','
                            }
                            if(usersNickname != '')
                            {
                                usersNickname+=','
                            }
                            usersId+=user.id
                            usersNickname+=user.nikeName
                        }
                })

                let users ={
                    userId : usersId,
                    userName: usersNickname
                }
                this.$emit("sendMsgs", result, users);
               }else{
                    this.$emit("sendMsgs", result);

               }
               
            }
            this.eValData = "";
            this.record= ""
            this.activeRecord=false
            this.atUserArr = [];
            this.$store.commit('SET_EVAL', this.eValData)
        },
        stoptime() {
            clearInterval(this.timer);
            this.timer = null;
            this.isDisabled = false
            this.placeholder = ''
        },
        sendTOut(muteTimesPro) {
            this.timer = setTimeout(() => {
                // ${muteTimesPro}秒
                // this.placeholder = `您已被禁言,再过${this.muteTimes}秒后可以发言`
                var minutes = Math.floor(this.muteTimes / 60)
                
                var seconds = this.muteTimes - minutes * 60;
                this.placeholder = this.$t('muteDesc1',[minutes,seconds])

                this.muteTimes--;
                if (this.muteTimes <= 0) {
                    this.isDisabled = false
                    this.placeholder = this.keyMsg
                } else {
                    this.sendTOut(muteTimesPro);
                }
            }, 1000);
        },
        muteFunc(muteInt,sendTime){
            
            let nowTime = this.getNowTime()

            this.muteTimes = muteInt - nowTime;
            let isMute = this.muteTimes > 0
            this.isDisabled = isMute
            // this.muteTimes = muteTimes;
            
            if(isMute){
                this.sendTOut()
            }else{
                this.isDisabled = false
                this.placeholder = this.keyMsg
            }
        },
        doEmit(){
            // 会员禁言
            // Member Mute
            this.$bus.$off('beMute') 
            this.$bus.$on('beMute',(data,sendTime) => {
                this.stoptime()
                this.muteFunc(data.muteInt)
            }) 

            // 聊天对象改变了
            // The chat partner has changed
            this.$bus.$off('chatInfoChange')
            this.$bus.$on('chatInfoChange',(chatInfo) => {
                // 重置计时器
                // reset timer
                this.stoptime()
                // 如果是私聊就直接关闭定时器
                // If it is a private chat, just turn off the timer
                if(this.getRoomTypes(chatInfo.roomIdAndId)==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
                    this.isDisabled = false
                    this.placeholder = this.keyMsg
                    return
                }
                // 这里的需要获取 当前聊天对象 的禁言状态
                // Here you need to get the muted status of the current chat partner
                this.chatInfoPro = chatInfo

                // 如果存在禁言问题 则需要重置计时器 找到对应的禁言时间
                // 推送来的时候 在其他房间的时候 需要请求房间详情 以更新房间会员信息 用户信息
                // If there is a mute problem, you need to reset the timer to find the corresponding mute time
                // When it is pushed, it is necessary to request room details in other rooms to update the room membership information. User information

                let meInfo = this.roomsMemberObj[this.chatInfo.roomIdAndId]&&this.roomsMemberObj[this.chatInfo.roomIdAndId][this.userInfo.id]
                if(meInfo){
                    let {muteInt, role} = meInfo
                    if(chatInfo.status==2&&role==1){
                        this.isDisabled = true
                        this.placeholder = this.$t('muteDesc2')
                        return
                    }
                    this.muteFunc(muteInt)
                }else{
                    this.isDisabled = false
                    this.placeholder = this.keyMsg
                }

            })
            // 实时房间禁言
            // Real-time room muting
            this.$bus.$off('toMute')
            this.$bus.$on('toMute',()=> {
                
                if(this.chatInfoPro){
                    let meInfo = this.roomsMemberObj[this.chatInfoPro.roomIdAndId][this.userInfo.id]
                    if(meInfo.role==1){
                        this.isDisabled = true
                        this.placeholder = this.$t('muteDesc2')

                        // if(!meInfo.muteRooms){
                        //     meInfo.muteRooms = []
                        // }
                        // meInfo.muteRooms.push(this.chatInfoPro.roomIdAndId) // 存储禁言房间
                        // meInfo.muteRooms = this.unique(meInfo.muteRooms) // 去重
                    }

                    // this.$store.commit('UPDATE_USERS_OBJ', meInfo)
                }


            })
            // 实时房间禁言解除
            // Real-time room ban is lifted
            this.$bus.$off('unMute')
            this.$bus.$on('unMute',()=>{
                this.isDisabled = false
                this.placeholder = this.keyMsg
            })


        },
        sendFCopyImg(){

            this.$emit("chooseFile", this.copyImgFile, this.copyImgUrl, 1);
            this.showCopyImg = false;
        },
        hideCopyImg(){
            this.showCopyImg = false;
        }

    },
}
</script>

<style lang="scss" scoped>
/deep/ .emoji-picker{
    position: absolute;
    top: 50px;
    width: 100%!important;
}
.audio-container>div{
    border-radius: 5px;
    box-shadow: 5px 5px 10px -4px #ccc;
    margin: 0;
    height: 30px;
    margin-left: 2px;
}
.delete-voice-after{
    position: absolute;
    right: 63px;
    top: 6px;
    color: red;
    background: #fff;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0px 7px 10px -8px #63645e;
}
.chat-boxs {
    font-size: 16px;
    /* height: 80px; */
    background: #fff;
    display: flex;
    align-items: flex-end;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: visible;
    border-top: 1px solid #E0E3E5;
    /* border: 1px solid red; */
    &.keypressMsg{
        .im-upfiles{
            display: none;
        }
        .send-input{
            .sendIcon{
                display: block;
            }
            &.showDialogImo {
                
            }
        }
    }
    .send-input{
            &.showDialogImo {
                
            }
    }
    .im-upfiles{
        margin-bottom: 0px;
        transition: .5s all;
    }
    .timer-send {
        margin-right: 21px;
        color: red;
        font-weight: 500;
    }
    .send-input {
        flex: 1;
        background: #F0F1F4;
        height: 38px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        position: relative;
        margin-bottom: 6px;

        .editor{
            position: relative;
            font-size: 14px;
            flex: 1;
            height: 100%;
            background: #f1f1f2;
            border: 0;
            outline: none;
            border-radius: 0 50% 50% 0;
            resize: none;
            padding: 10px 0;
            padding-right: 55px;
        }
        .sendIcon{
            cursor: pointer;
            position: absolute;
            right: 20px;
            font-size: 30px;
            display: none;
            color: var(--primary-color);
            transition: .5s all;
        }
        .audio-container {
            position: absolute;
            left: 37px;
        }

        audio {
            height: 29px;
            outline: none!important;
        }
        .im-emoji{
            width: calc(100vw - 379px);
            position: absolute;
            top: -249px;
            height: 250px;
            border: 1px solid #f1f1f2;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            background: #fff;
            overflow: hidden;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            &.quotaActive {
                    top: -303px;
                }
            img{
                cursor: pointer;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
            }
            .im-cusmoji{
                margin-top: 10px;
                flex: 1;
                overflow: scroll;
            }
            .dynamic{
                display: inline-block;
            }
            /* 隐藏图片功能 */
            /deep/ .el-upload-list{
                display: none;
            }
            /deep/ .el-button--primary.is-plain{
                &:focus{
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: #FFF;
                }
                &:hover{
                    color: var(--primary-color);
                    background: #ecf5ff;
                    border-color: #b3d8ff;
                }
                &.active{
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: #FFF;
                    &:hover{
                        background: var(--primary-color);
                        border-color: var(--primary-color);
                        color: #FFF;
                    }
                }
            }
            
        }
    }

    .send-tool-item {
        margin-left: 0px;
        width: 38px;
        height: 38px;
        background: #f1f1f2;
        border-radius: 50%;
        text-align: center;
        line-height: 38px;
        font-size: 20px;
        cursor: pointer;

        &:hover {
            background: #e5e4e8;
        }
    }
    .send-nouse{
        cursor: text;
        &:hover {
            background: #f1f1f2;
        }
    }
}
.members-groups{
   /*  position: absolute;
    bottom: 46px;
    background: #fff;
    left: -15px;
    padding: 0 13px;
    right: -15px; */
    header#el-drawer__title {
            display: none;
        }
    .el-drawer__wrapper {
        width: calc(100% - 359px);
        right: 0;
        left: initial;
        bottom: 53px;
        
    }
    ul{
        padding: 0 10px;
    }
    ul.member-in-group li {
        display: inline-flex;
        width: 100%;
        line-height: 2.5;
        padding: 5px 0;
        position: relative;
        cursor: pointer;
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
            width: 41.59px;
            height: 41px;
            line-height: 41px;
            font-size: 9px;
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
}
#editor{
    width: 100%;
    height: 100%;
    border: 0;
    padding: 9px;
    resize: none;
    background:#F0F1F4 ;
    border-radius: 20px;
    outline: none;
    &:focus{
        border: 0;
    }
}
.copy-img{
    position: fixed;
   width: 100%;
        height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background: rgba($color: #000000, $alpha: .3);
    .copy-img-box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    background: #f0f0f0;
    text-align: center;
    padding: 20px;
        img{
            max-width: 300px;
            max-height: 500px;
        }
        .sendIcon{
                text-align: right;
    font-size: 30px;
      color: var(--primary-color);
    margin-top: 20px;
    svg{
         cursor: pointer;
    }
   
        }
    }
}
</style>
