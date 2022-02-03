<template>
<div class="update-box">
    <div v-if="!hasNewVersvion">
        
        <img  :src="require('@/assets/svg/logo.png')" class="logo" alt="" >
        <h4>{{$t('currentVersion',[versionInfo.version])}}</h4>
        <h5>{{versionInfo.mustUpdate == 1 ? versionInfo.content : $t('updVersionDesc')}}</h5>
        <div class="update-btn" >
            <el-button type="primary" :loading="hasVersion" @click="getVersion">{{$t('checkForUpdates')}}</el-button>
        </div>
        <p class="copy">&copy; 2021</p>
    </div>

    <new-version v-if="hasNewVersvion" @back="closeBack"></new-version>
    

</div>
</template>
<script>
import newVersion from "./newVersion";
import { checkAppVersion } from '@/services'
export default {
    components: {
        newVersion,
    },
    data() {
        return {
            activeIdx: 1,
            hasVersion: false,
            hasNewVersvion: false,
            versionInfo: {
                // mustUpdate 2不用更新 1需要更新
            }
        }
    },
    mounted() {
        this.getVersion()
    },
    methods: {
        getVersion() {
            this.hasVersion = true;
            setTimeout(() => {
                  this.hasVersion = false;
            }, 1000);
            // checkAppVersion().then(res => {
            //     if(res.success){
            //         this.versionInfo = res.data
            //         console.log(this.versionInfo)
            //         this.hasVersion = false;
            //         if(this.versionInfo.mustUpdate==2){
            //             this.hasNewVersvion = true;
            //         }

            //     }else{
            //         this.$message.error(res.message)
            //     }
            // })
        },
        closeBack() {
            this.hasNewVersvion = false;
        }
    },
}
</script>

<style lang="scss" scoped>
.update-box {
    text-align: center;
    background: #fff;
    position: relative;
    height: 100%;

    .logo {
        margin-top: 15px;
        width: 140px;
        margin-bottom: 15px;
    }

    h3 {
        margin-top: 20px;
        font-size: 20px;
    }

    h4 {
        margin-top: 12px;
        font-size: 13px;
        color: #000;
    }

    h5 {
        margin-top: 12px;
        font-size: 14px;
        color: #999DA0;
        font-weight: 100;
    }

    .update-btn {
        margin-top: 25px;
        .el-button{
            background: var(--primary-color);
            text-transform: capitalize;
            font-size: 14px;
        }
    }

    .copy {
        margin-top: 25px;
        text-align: center;
        font-size: 12px;
        color: #999DA0;
    }
}
</style>
