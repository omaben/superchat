<template>
    <el-container class="profile-info">
                <el-header>
                    <div style="position:relative">
                        <div class="backInfo" @click="back">
                            <img  :src="require('@/assets/svg/back-user.svg')" alt="">
                            <span>{{$t('back')}}</span>
                            
                        </div>
                        <p>{{$t('birthday')}}</p>
                        <div class="add-member-btn">
                            <el-button type="primary" @click="confirms()">{{$t('Update')}}</el-button>
                        </div>
                        
                    </div>
                </el-header>
                <el-main>
                    <div class="update-box">
                            <p>
                                {{$t('Please choose your Birthday')}}
                            </p>
                            <div class="update-input">
                                <el-date-picker v-model="birthday" type="date" :placeholder="$t('p_sel')"
                                    format="yyyy-MM-dd" value-format="yyyy-MM-dd"  :picker-options="pickerOptions">
                                </el-date-picker>
                            </div>
                        </div>
                </el-main>
    </el-container>

</template>

<script>
export default {
    props: ["info"],
    data(){
        return {
            birthday: "",
            pickerOptions: {
          			disabledDate(time) {
          	 			return time.getTime() > Date.now();
          			}
        	},
        }
    },
    mounted() {
        this.birthday = this.info.birthday;
        
    },
    methods: {
        
        confirms() {
            this.$emit('childBack', true, this.birthday)
        },
        back(){
            this.$emit('childBack', false)
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
        border-radius: 5px;
        ul {
            background: #fff;
            padding: 15px;
            border-radius: 9px;
            border: none;
            li {
                padding: 15px 0;
                border-bottom: 1px solid #E0E3E5;
                cursor: pointer;
                &:last-child {
                    border: none;
                    padding-bottom: 0;
                }
                &:first-child {
                    padding-top: 0;
                }
                &.select{
                    img{
                        opacity: 1;
                    }
                }
                img{
                    float: right;
                    opacity: 0;
                }
            }

        }
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
