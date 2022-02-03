<template>
    <div class="session-list">
        <el-card :body-style="{ padding: '0px' }" v-for="(item,index) in allDiscovery" :key='index'>
            <div class="img-discover" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
            <div class="info-discover">
                <span>{{item.name}}</span>
                <div class="bottom-button clearfix ">
                    <el-button class="button-discover" @click="openLink(item.link)" type="text">{{$t('disView')}}</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { discovery} from "@/services";


export default {
    components: {
       
    },
    data() {
        return {
            allDiscovery : []
        }
    },
    mounted() {
        this.getDiscovery()
    },
    methods: {
        openLink(link){
            require('electron').shell.openExternal(link);
        },
        async getDiscovery(){   

            await discovery().then(res => {
                if(res.success){
                    this.allDiscovery = res.data
                    console.log(this.allDiscovery)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.session-list {
    position: relative;
    height: 100%;
    overflow-y: auto;
    font-size: 16px;
    padding: 20px;
    .el-card{
        margin-top: 20px;
        &:first-child {
            margin-top: 0;
        }
        .img-discover {
            width: 100%;
            height: 200px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center bottom;
        }
        img{
            width: 100%;
        }
        .info-discover {
            padding: 12px;
            padding-bottom: 0;
            .bottom-button {
                margin-left: -12px;
                margin-right: -12px;
                background: orange;
                margin-top: 12px;
                text-align: center;
                .button-discover {
                    color: #fff;
                }
            }
        }
    }
    
}
</style>