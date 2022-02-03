<template>
    <el-container class="profile-info">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('feedback')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="onSubmit()">{{$t('Update')}}</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('wellFeedBack')}} :
                            </p>
                            <div class="update-input">
                                <el-input type="textarea" maxlength="300" show-word-limit resize="none" rows="15" v-model="content"></el-input>
                            </div>
                        </div>
                </el-main>
    </el-container>
</template>

<script>
import { feedback } from '@/services'
import { mapGetters } from "vuex";
export default {
    components: {},
    data() {
        return {
            content: ''
        }
    },
    mounted() {

    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
    },
    methods: {
        back(){
            this.$emit('childBack', false)
        },
        onSubmit() {
            if(!this.content)return
            feedback({content: this.content}).then(res => {
                if(res.success){
                    this.$message.success(this.$t('submitSucc'))
                    this.content = ""
                }else{
                    this.$message.error(res.message)
                }
            })
        }

    },
}
</script>

<style lang="scss" scoped>
.update-box {
    position: relative;
    width: 500px;
    margin: 0 auto;

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
        font-size: 14px;
        color: #999DA0;
        margin-bottom: 15px;
    }

    .update-input {
        border: 1px solid #ddd;
        border-radius: 5px;
       
    }

    .sub-btn {
        margin-top: 20px;

        button {
            width: 120px;
        }
    }
}
    .el-main{
        background: #F0F3F4 !important;
        height: calc(100vh - 60px);
        padding-top: 25px;
        .el-input__inner{
            border: none;
        }
    }
</style>
