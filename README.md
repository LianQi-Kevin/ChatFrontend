# ChatFrontend Chat

### Todo

* [x] 完成 OpenAI API 封装
* [ ] 支持 i18n
* [ ] 支持已发送修改 [MarkdownRenderer.vue](src/components/MarkdownRenderer.vue)
* [ ] 使用 localforage 支持历史记录
* [ ] 使用 [tauri](https://github.com/tauri-apps/tauri) 替换 electron-builder 封装桌面应用

---

### install electron && electron-builder

> 详参: [添加 Electron 和 electron-builder 到现有 Vite 项目](https://blog.csdn.net/liuliu123456790/article/details/135902415)

1. 设置代理

    ```shell
    $env:ELECTRON_GET_USE_PROXY=1
    $env:GLOBAL_AGENT_HTTP_PROXY='http://127.0.0.1:52539'
    $env:GLOBAL_AGENT_HTTPS_PROXY='http://127.0.0.1:52539'
    ```

2. 安装 electron 和 electron-builder

    ```shell
    npm install --verbose electron electron-builder --save-dev
    ```