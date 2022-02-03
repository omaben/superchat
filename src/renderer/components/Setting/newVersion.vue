<template>
<div class="update-box">
    <img src="@/assets/icon_genxbg.png" class="logo" alt="">
    <h3>{{$t('newVersionFound',['v1.0.2'])}}</h3>
    <h5>{{$t('currentVersion',['v1.0.1'])}}</h5>
    <div class="update-btn">
        <el-button type="primary" :loading="hasVersion" @click="updateVersion">{{$t('updImmediately')}}</el-button>
    </div>
    <div class="update-close-btn">
        <el-button plain @click="goBack">{{$t('cancel')}}</el-button>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
            activeIdx: 1,
            hasVersion: false

        }
    },
    mounted() {

    },
    methods: {
        updateVersion() {

        },

        goBack() {
            this.$emit('back', true);

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
        margin-top: 40px;
        width: 300px;
    }

    h3 {
        font-size: 20px;
    }

    h5 {
        margin-top: 12px;
        font-size: 14px;
        color: #666;
    }

    .update-btn {
        position: absolute;
        left: 50%;
        bottom: 160px;
        transform: translate(-50%, 0);

        button {
            width: 150px;
        }
    }

    .update-close-btn {
        position: absolute;
        left: 50%;
        bottom: 100px;
        transform: translate(-50%, 0);

        button {
            width: 150px;
        }
    }

}
</style>
