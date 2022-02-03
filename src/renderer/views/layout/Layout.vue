<template>
<div class="app-wrapper">
    <sidebar class="sidebar-container" @closeFiles2='closeFiles()'></sidebar>
    <div class="main-container " :class="{'with-gallery':activeGallery}" >
        <app-main @openFiles="openFiles" ></app-main>
    </div>
    <user-info :showUserInfo="showUserInfo"></user-info>
    
    <!-- <files class="gallery-item" :class="{'with-gallery':activeGallery}" @closeFiles='closeFiles()' :list='list'></files> -->
</div>
</template>

<script>
import UserInfo from "@/components/Details/User";
import {
    Sidebar,
    AppMain,
} from './components'

export default {
    name: 'layout',
    components: {
        Sidebar,
        AppMain,
        UserInfo
    },
    data() {
        return {
            activeGallery:false,
            list:[],
            showUserInfo : false,
        };
    },
    mounted() {
        this.$bus.$off('show_user_info')
        this.$bus.$on('show_user_info',(data) => {
            this.showUserInfo = data
        })
    },
    updated() {

        this.$bus.$off('show_user_info')
        this.$bus.$on('show_user_info',(data) => {
            this.showUserInfo = data
        })
    },
    methods: {
        openFiles(list){
            this.activeGallery=!this.activeGallery
            this.list=list
        },
        closeFiles(){
            this.activeGallery=false
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
}
.gallery-item {
    transition: .5s all;
    width: 320px !important;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    right: -100%;
    z-index: 1001;
    overflow: hidden;
    background: #f1f1f4;
    border-right: 1px solid #ddd;
}
.gallery-item.with-gallery {
    right: 0;
}
.main-container{
transition: all .5s ease-in-out  !important;
margin-right: 0;
}
.main-container.with-gallery {
    margin-right: 320px;
}

</style>
