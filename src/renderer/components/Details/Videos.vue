<template>
    <div class="video-tabs">
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
                        <img class="ico-video" :src="require('@/assets/svg/ico-video.svg')" alt="">
                        <el-image 
                            style="width: 100px; height: 100px"
                            :src="images[i - 1]" 
                            fit="cover"
                        >
                        </el-image>
                    </div>
                </li>
            </ul>
            <div class="carousel-lingallery" v-if="showSlider">
                <img @click="showSlider = false" class="close-carousel" :src="require('@/assets/svg/close-carousel.svg')" alt="">
                <VueSlickCarousel
                    ref="c1"
                    :asNavFor="$refs.c2"
                    :focusOnSelect="true"
                    >
                    <div 
                        v-for="(item, index) in bigImages" 
                            :key="index"
                            class="big-slider"
                    >
                                 <video  controls>
                                    <source :src="item" type="video/mp4">
                                </video>

                    </div>
                    
                </VueSlickCarousel>
                <VueSlickCarousel
                    ref="c2"
                    :asNavFor="$refs.c1"
                    :slidesToShow="slidesToShow"
                    :focusOnSelect="true"
                >
                    <div 
                        v-for="(item, index) in images" 
                            :key="index"
                            class="thumb"
                    >
                           <el-image 
                                style="width: 100px; height: 100px"
                                :src="item" 
                                fit="cover"
                            >
                            </el-image>
                       
                    </div>
                </VueSlickCarousel>
            </div>
            
            <p v-if="loading">Loading...</p>
            <p v-if="noMore"></p>
        </div>
    </div>
</template>
<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
    props: ["thumbUrls","urls"],
    data() {
        return {
            count: 0,
            loading: false,
            showSlider: false,
            bigImages : [],
            images: [],
            startImage: 0,
            slidesToShow: 0,
            settings: {
                arrows: true,
                dots: false,
                focusOnSelect : true
            },
        }
    },
    components: {
        VueSlickCarousel
    },
    computed: {
        noMore () {
            return this.count >= this.images.length
        },
        disabled () {
            return this.loading || this.noMore
        }
    },
    mounted() {
        this.$bus.$off('getVideo')
        this.$bus.$on('getVideo', (count,images,bigImages) => {
               this.count = count
               this.slidesToShow = count > 8 ? 8 : count
               this.images = images
               this.bigImages = bigImages
        })
    },
    methods: {
        showSliderFunc(i){
            this.showSlider = true
            this.startImage = i
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
<style lang="scss" scoped>
    .video-tabs{
        height: 100%;
        .demo-image__preview{
            &::before{
                content: '';
            }
            .ico-video{
                width: 25px;
                height: 25px;
            }
        }
        
    }
</style>