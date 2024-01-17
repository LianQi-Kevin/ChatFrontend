import {createRouter, createWebHistory} from "vue-router";
import routes from "@/router/routes.js";

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});


// 根据meta.title修改页面标题
// router.afterEach 全局后置守卫, 导航结束后执行
router.afterEach((to) => {
    // 如果routes的meta中定义了title，则修改页面title
    if (to.meta['title']) {
        document.title = to.meta['title'];
    }
});

export default router