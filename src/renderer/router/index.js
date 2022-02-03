import Vue from "vue";
import Router from "vue-router";

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)
// console.log(process.env.BASE_URL,'BASE_URL:')
/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
    // { path: '/login', name: "login", component: () => import('@/views/auth/Login'), hidden: true },
    { path: '/loginPhone', name: "loginPhone", component: () => import('@/views/auth/LoginPhone'), hidden: true },
    // { path: '/register', name: "register", component: () => import('@/views/auth/Registered'), hidden: true },
    { path: '/registerPhone', name: "registerPhone", component: () => import('@/views/auth/RegisteredPhone'), hidden: true },
    { path: '/forgetPWD', name: "forget", component: () => import('@/views/auth/ForgetPWD'), hidden: true },
    { path: '/setPWD', name: "set", component: () => import('@/views/auth/SetPWD'), hidden: true },
    { path: '/404', component: () => import('@/views/404'), hidden: true },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () => import('@/views/dashboard/index')
        }]
    },

    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

