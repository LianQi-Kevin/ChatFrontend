import {createRouter, createWebHistory} from "vue-router";
import routes from "@/router/routes.js";
import DB from "@/tools/db.js";

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

router.beforeEach(async (to, _from, next) => {
    if (to.meta['verifyAPIConfig']) {
        // 校验config是否存在
        if (await DB.getItem('apiCredentials')) {
            // 已登录
            next();
        } else {
            next({
                path: '/config',
                query: {
                    redirect: to.fullPath
                }
            });
        }
    } else {
        // 不需要鉴权，直接调用 next()
        next();
    }
})


// 根据meta.title修改页面标题
// router.afterEach 全局后置守卫, 导航结束后执行
router.afterEach((to) => {
    // 如果routes的meta中定义了title，则修改页面title
    if (to.meta['title']) {
        document.title = to.meta['title'];
    }
});

export default router;