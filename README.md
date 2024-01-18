# XingHuo Chat

针对讯飞的[星火认知大模型](https://xinghuo.xfyun.cn/)创建的api调用demo

---

* [星火认知大模型Web API文档](https://www.xfyun.cn/doc/spark/Web.html)
* [Vue-router](https://router.vuejs.org/zh/guide/)
* [element-plus](https://element-plus.org/zh-CN/component/button.html)

---

#### Install electron & electron-builder

```shell
npm config set proxy=http://127.0.0.1:12345
npm config set registry=https://registry.npmjs.org

$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_CUSTOM_DIR="{{ version }}"
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
npm install --verbose electron --save-dev
```