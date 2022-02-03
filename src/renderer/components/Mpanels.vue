<template>
    <!--滑动验证-->
    <div v-show="Mpanel">
        <div id="mpanel">
            <div class="mpanel-box"></div>
        </div>
    </div>
    <!-- 验证码 end -->
</template>

<script>
import { captchaPuzzle } from "@/services/index"

export default {
    props:["type","mpanelShow","account"],
    data() {
        return {
            Mpanel:false,
        }
    },
    watch: {
        account(val){
        },
        mpanelShow(val){
            this.$("#mpanel").show();
        }
    },
    mounted() {
		this.verification();
	},
    methods: {
        //滑块
        verification(){
            captchaPuzzle().then((res) =>{
                let data = res;
                if (data.success) {
                    this.Mpanel = true;
                    this.$('#mpanel').fadeIn();
                    let datas = data.data;
                    this.slidingverLogin(datas);
                }else{
                    this.Mpanel = false
                    this.$message.error(res.message)
                }
            }).catch((error)=> {
                this.Mpanel = false
                this.$message.error(error.msg)
            })
        },
        //滑块组建
        slidingverLogin(y) {
            let _this = this;
            let type = this.type;
            this.$('#mpanel .mpanel-box').empty().show();
            this.$('#mpanel .mpanel-box').slideVerify({
                account: this.account, // 注册不用传 登录的时候传
                codeId: y.id,
                type: 2, //类型
                vOffset: type, //1注册 2登陆
                vSpace: 5, //间隔
                imgUrl: "data:image/png;base64," + y.normal,
                smallImg: "data:image/png;base64," + y.small,
                imgSize: {
                    width: y.imgx + 'px',
                    height: y.imgy + 'px',
                },
                blockSize: {
                    width: y.sImgx + 'px',
                    height: y.sImgy + 'px',
                },
                barSize: {
                    width: y.imgx + 'px',
                    height: y.sImgx + 'px',
                },
                rand2: y.y,
                ready: function () {},
                success: function (ele,data) {
                    _this.$("#mpanel").fadeOut();
                    // _this.$message.success('操作成功！')
                    _this.$emit("success", data, y.id);
                },
                error: function (ele,data) {
                    _this.$message.error(data.message)
                    _this.verification()
                },
                close: function () {
                    _this.$("#mpanel").hide();
                    _this.$emit("close");
                }
            });
            this.$('.verify-refresh').on('click', function () {
                _this.verification();
            });
        },
    },
}
</script>

<style lang="scss" scoped>
@import url("~@/styles/verify.scss");
</style>