import Vue from 'vue'
import VueRouter from 'vue-router'

// 懶加載
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')
const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/Users')
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params')
const List = () => import(/* webpackChunkName: "goodsList_Add" */ '../components/goods/List')
const Goods = () => import(/* webpackChunkName: "goodsList_Add" */ '../components/goods/Goods')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/member',
          component: Users
        },
        {
          path: '/category',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/goods',
          component: Goods,
          name: 'goods'
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // to 將要訪問的路徑
// from, 代表從哪個路徑來
// next 是一個函數,表示放行
// next() 放行 , next('/login') 強制跳轉
  if (to.path === '/login') return next()
  // 獲取Token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
