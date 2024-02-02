# XingHuo Chat

针对讯飞的[星火认知大模型](https://xinghuo.xfyun.cn/)创建的api调用demo

---

* [星火认知大模型Web API文档](https://www.xfyun.cn/doc/spark/Web.html)
* [Vue-router](https://router.vuejs.org/zh/guide/)
* [element-plus](https://element-plus.org/zh-CN/component/button.html)

---

### Todo

* [ ] 完成星火大模型 WebSocket API 封装
* [ ] 支持 i18n
* [ ] 支持已发送修改 [MarkdownRenderer.vue](src/components/MarkdownRenderer.vue)
* [ ] 支持历史记录

---

### install electron && electron-builder

> 详参: [添加 Electron 和 electron-builder 到现有 Vite 项目](https://blog.csdn.net/liuliu123456790/article/details/135902415)

* 方法一：设置代理（已配置于[.npmrc](./.npmrc)）

```shell
$env:ELECTRON_GET_USE_PROXY=1
$env:GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:52539
$env:GLOBAL_AGENT_HTTPS_PROXY=http://127.0.0.1:52539
```

* 方法二：设置淘宝镜像

```shell
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
ELECTRON_CUSTOM_DIR="{{ version }}"
```

* Install

```shell
npm install --verbose electron electron-builder --save-dev
```