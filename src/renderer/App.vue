<template>
  <div id="app">
      <vue-internet-checker
            @status="status"
            @event="event"
    />
    <p class="off-network" v-if="!onLine">No internet connection check network</p>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import {loginStore,getUserStore,setUserStore} from 'tool/storage.js'
import Bus from "@/services/bus";
import vueInternetChecker from 'vue-internet-checker';
import IM from "@/services/im/connect";
import {appConfig} from "@/services/index"
import { chatInRoomsDAO , NoticeMsgDAO } from "@/services/db";

import {
    mapGetters
} from 'vuex'


export default {
  name: 'App',
  provide() {
      return {
          reload: this.reload
      };
  },
  components: {
      vueInternetChecker,
    },
  computed: {
      ...mapGetters([
          'token',
      ])
  },
  data() {
      return {
          isRouterAlive: true,
          onLine: true,
      };
  },
  mounted(){
      if(this.getUserStore('token') === 1){
            this.$store.commit("SET_TOKEN", null);
            this.$electron.ipcRenderer.send('logout')
      }
      //if(getUserStore.)
        this.$electron.ipcRenderer.on('OpenNewSession', (event, arg) => {
            console.log(event)
            console.log('console bendada New session')
            this.$store.commit("SET_TOKEN", null);
             this.$electron.ipcRenderer.send('logout')
        })
        if (this.token) {
            this.$electron.ipcRenderer.send('logined')
            this.getAdminInfoFunc();
            IM();
        }else{
            this.getAppConfig()
            this.$router.push('/loginPhone').catch(()=>{})
        }
        
        
  },
  methods: {
      async getAppConfig(){
            await appConfig().then(res=>{
                if(res && res.success){
                    this.$store.commit("SET_APP_CONFIG", JSON.stringify(res.data));
                     this.$bus.$emit('updateAppConfig')
                     let that = this
                    that.$router.push('/loginPhone').catch(()=>{})

                }else{
                    //this.$message.error(res)
                   this.getAppConfig() 
                }
            })
        },
      status(ele) {
        //console.log(ele);
        this.onLine = ele;
        sessionStorage.setItem('onLine',ele)
      },
      event(ele) {
        //console.log(ele);
      },
      async getAdminInfoFunc() {

            // this.dbUser.getInstance().close()
            //   好友，房间消息，请求完成之后才能接受离线消息
            
            const [errInfo, dataInfo] = await this.awaitWrap(this.$store.dispatch('GetInfo'))
            if(errInfo){
                //this.$message.error(errInfo)
            }
            // this.dbUser.getInstance().open()
            
            this.$store.dispatch('GetTeams').then().catch(err=>{
                //this.$message.error(err)
            })
            
            this.$store.dispatch('FindRoomRelation').then().catch(err=>{
                //this.$message.error(err)
            })
            
            this.$store.dispatch('GetFriends').then().catch(err=>{
                //this.$message.error(err)
            })
            const [errInfos, dataInfos] = await this.awaitWrap(this.$store.dispatch('GetUserSessionList'))
            
            
            this.$store.dispatch('GetBatchs').then().catch(err=>{
                //this.$message.error(err)
            })

            // const [errFriend, dataFriend] = await this.awaitWrap(this.$store.dispatch('GetFriends'))
            // if(errFriend){
            //     this.$message.error(errFriend)
            //     return
            // }
            // const [errRoom, dataRoom] = await this.awaitWrap(this.$store.dispatch('FindRoomRelation'))
            // if(errRoom){
            //     this.$message.error(errRoom)
            //     return
            // }
            // const [errOffLine, dataOffLine] = await this.awaitWrap(this.$store.dispatch('GetOffLineMsg'))
            // if(errOffLine){
            //     this.$message.error(errOffLine)
            //     return
            // }
            
            let getInstanceNotice = NoticeMsgDAO.getInstance();
            getInstanceNotice.getLast().then(async (result)=>{
                let noticeMsg
                if(result){
                    noticeMsg = {
                            id: result.msgId,
                    }
                }else{
                    noticeMsg = {
                            id: 0,
                    }
                }
                const [err, resp] = await this.awaitWrap(this.$store.dispatch('GetOfflineNoticeMsgById', noticeMsg))
            })
            
      },
      
      reload() {
          this.isRouterAlive = false;
          this.$nextTick(function () {
              this.isRouterAlive = true;
          });
      }
  }
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
