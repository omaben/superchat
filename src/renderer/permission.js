import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'

const whiteList = ['/loginPhone', '/registerPhone', '/forgetPWD', '/setPWD', '/dashboard'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start()
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo && userInfo.token) {
        // 是否登录
        if (to.path === "/") {
            next({ path: "/dashboard" });
            NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            next();
            // if (store.getters.roles.length === 0) {
            //   store.dispatch('GetInfo').then(res => { // 拉取用户信息
            //     next()
            //   }).catch((err) => {
            //     store.dispatch('FedLogOut').then(() => {
            //       Message.error(err || 'Verification failed, please login again')
            //       next({ path: '/' })
            //     })
            //   })
            // } else {
            //   next()
            // }
        }
    } else {
        if (to.path === "/") {
            next("/loginPhone");
            NProgress.done();
        } else if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next("/loginPhone");
            NProgress.done();
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})