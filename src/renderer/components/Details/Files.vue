<template>
    <div class="file-detail ">
         <div class="infinite-list-wrapper">
            <ul
                v-if="files.length>0"
                class="list"
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled"
            >
                <li v-for="i in count" :key="i" >
                    <!-- <el-divider class="time-pic-info">
                        04:16 PM 16-11-2021
                    </el-divider> -->
                    <div class="info-files" @click="downloadFile(files[i - 1])">
                        <img :src="require('@/assets/svg/pdf-other.svg')" alt="">
                        <div class="text-info-file">
                            <h6>{{files[i - 1].fileName}}</h6>
                            <p>{{formatFileSize(files[i - 1].size)}}</p>
                        </div>
                    </div>
                </li>
            </ul>
         </div>
         <p v-if="loading">Loading...</p>
        <p v-if="noMore"></p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            files: [],
            count: 16,
            loading: false,
        }
    },
    computed: {
        noMore () {
            return this.count >= this.files.length
        },
        disabled () {
            return this.loading || this.noMore
        }
    },
    mounted() {
        
        this.$bus.$off('getFiles')
        this.$bus.$on('getFiles', (count,files) => {
               this.count = count
               this.files = files
        })
    },
    methods: {
        load () {
            this.loading = true
            setTimeout(() => {
                if(this.files.length - this.count> 8){
                    this.count += 8
                }else{
                    this.count += this.files.length - this.count
                }
                this.loading = false
            }, 500)
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
        downloadFile(msg){
            let { picUrl,url,fileName } = msg
            this.downloadUrlFile(picUrl||url, fileName)
        },
    },
}
</script>
<style lang="scss" scoped>
    .file-detail{
        overflow: auto;
        height: 100%;
        padding: 10px;
        .infinite-list-wrapper {
            height: 100% !important;
        }
        .info-files {
            cursor: pointer;
            width: 100%;
            display: inline-flex;
            .text-info-file {
                border-bottom: 1px solid #F0F3F4;
                padding-bottom: 10px;
                margin-left: 10px;
                padding-top: 4px;
                width: 100%;
                h6 {
                    color: var(--primary-color);
                    font-size: 14px;
                }
                p {
                    color: #B3B3B3;
                    font-size: 11px;
                }
            }
        }
    }
    
</style>