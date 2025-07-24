import { createRouter, createWebHashHistory } from "vue-router"
import { TOKEN_KEY } from '@/config/constant'
import layout from "@/layout/index.vue"


// 权限验证
function auth() {
  const token = window.sessionStorage.getItem(TOKEN_KEY) // 那九龙富阳水旱灾害的token

  if (token) return true
  return true; // 这里可以添加实际的权限验证逻辑
}

const route = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: layout,
      redirect: () => ({path: '/demo1'}), // 默认重定向到 /demo1
      children: [
        { path: 'demo1', component: () => import('@/views/demo1/index.vue') }, 
      ]
    },
  ]
})

route.beforeEach((to, from, next) => {
  if (auth()) {
    next(); // 如果权限验证通过，继续路由导航
  } else {
    next({ path: '/403' }); // 如果权限验证不通过，重定向到 403 页面
  }
})

export default route
