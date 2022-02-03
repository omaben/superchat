<template>
    <div class="avatar-user-iinfo" @click="upAvatar()">
        <el-avatar :size="86" v-if="photo" :src="photo"></el-avatar>
        <el-avatar :size="86" v-else >{{info.nikeName && info.nikeName.slice(0,2)}}</el-avatar>
                        
    </div>

</template>

<script>
import {goimfilesUpload, modifyUser} from '@/services'
export default {
    props: ["info"],
    data() {
        return {
            photo: this.info.photo
        }
    },
    mounted() {
        this.$bus.$off('upsAvatar')
        this.$bus.$on('upsAvatar',(file, localPath) => {
            this.dealAvatar(file, localPath)
        })
    },
    methods: {
        async dealAvatar(file, localPath){
            let form = new FormData();
            form.append("file", file);
            form.append("fileType", 1); // 1头像<不鉴权>  2消息内容
            form.append("isOneToOne", false); //false=群聊 true=私聊
            form.append("from", "");
            form.append("to", "");
            let res = await goimfilesUpload(form)
            if(res.success){
                let data = res.data;
                this.photo = data.url;
                let post ={
                    ...this.info
                }
                this.$set(post,"photo",this.photo)
                modifyUser(post).then(res => {
                    if (res.success) {
                        this.$store.commit('SET_USERINFO', post) //同步更新个人资料
                        // this.$message.success("修改成功！")
                        this.$message.success(this.$t('doSucc'))
                    } else {
                        this.photo = this.info.photo
                        this.$message.error(res.message)
                    }
                })
            }else{
                this.$message.error(res.message)
            }
        },
        upAvatar(){
            this.$bus.$emit('upAvatar')
        },
        back() {
            this.$emit('childBack', false)
        },
        confirms(){
            this.$emit('childBack', true, this.photo)
        }
    },
}
</script>

<style lang="scss" scoped>
.update-box {
    background: #fff;
    position: relative;
    height: 100%;

    h5 {
        font-size: 16px;
        color: #333;
        cursor: pointer;

        i {
            vertical-align: middle;
            margin-right: 10px;
            font-size: 20px;
        }
    }

    p {
        margin: 50px 0;
        font-size: 12px;
        color: #666;
    }

    .avatar {
        margin: 0 auto;
        width: 150px;
        height: 150px;
        border-radius: 50%;

        .no-avatar,img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            font-size: 50px;
            color: #333;
            background: #f1f1f4;
            text-align: center;
            line-height: 150px;
            cursor: pointer;
        }
    }
    .sub-btn {
        margin-top: 20px;
        text-align: center;
        button {
            width: 120px;
        }
    }

}
.avatar-user-iinfo {
                padding: 20px;
                text-align: center;
                cursor: pointer;
                span{
                    font-size: 24px;
                }
            }
</style>
