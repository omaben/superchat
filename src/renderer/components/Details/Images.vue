<template>
    <div style="height:100%">
        <!-- <el-divider class="time-pic-info">
             04:16 PM 16-11-2021
        </el-divider> -->
        <div class="infinite-list-wrapper" style="overflow:auto">
            <ul
                class="list"
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled">
                <li v-for="i in count" :key="i" class="list-item">
                    <div class="demo-image__preview">
                        <el-image 
                            style="width: 100px; height: 100px"
                            :src="images[i - 1]"
                            @click="showSliderFunc(i - 1)"
                            fit="cover"
                           >
                        </el-image>
                    </div>
                </li>
            </ul>
            
            <div class="carousel-lingallery" v-if="showSlider">
                <img @click="showSlider = false" class="close-carousel" :src="require('@/assets/svg/close-carousel.svg')" alt="">
                <lingallery  :startImage='startImage'  :iid.sync="currentId" :responsive='responsive' :items="bigImages"/>
                <!-- <agile ref="main" :fade="true">...</agile>
                <agile ref="thumbnails" :as-nav-for="[$refs.main]" :slides-to-show="4" autoplay>...</agile>
             -->
            </div>
           <p v-if="loading">Loading...</p>
            <p v-if="noMore"></p>
        </div>
    </div>
</template>
<script>
import { chatLocalMsgDAO,chatInRoomsDAO } from "@/services/db";
import MSG_TYPE,{translateHTML} from "@/services/im/constant" //调试用
export default {
    data() {
        return {
            loading: false,
            showSlider:false,
            responsive: true,
            MSG_TYPE,
            count: 0,
            images:[],
            bigImages:[],
            width: 600,
            height: 500,
            currentId: 1,
            startImage:1
        }
    },
    computed: {
        noMore () {
            return this.count >= this.images.length
        },
        disabled () {
            return this.loading || this.noMore
        },
    },
   
    mounted() {
        this.$bus.$off('getImages')
        this.$bus.$on('getImages', (count,images,bigImages) => {
               this.count = count
               this.images = images
               this.bigImages = []
               bigImages.forEach((element,index) => {
                    let item = {
                        src: element.url,
                        thumbnail: element.thumbUrl,
                        id: index
                    }
                    this.bigImages.push(item)

               });
            this.$forceUpdate()
        })
    },
    methods: {
        showSliderFunc(i){
            this.showSlider = true
            this.startImage = i
        },
        updateImg(img){
            return img
        },
        load () {
            this.loading = true
            setTimeout(() => {
                if(this.images.length - this.count> 8){
                    this.count += 8
                }else{
                    this.count += this.images.length - this.count
                }
                this.loading = false
            }, 500)
        }
    },
}
</script>