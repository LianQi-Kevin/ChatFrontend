<script setup>
import {codeToHtml} from 'shiki/bundle/full'

import {CopyDocument} from "@element-plus/icons-vue";

const props = defineProps({
  lang: {
    required: false,
    type: String,
    default: 'plaintext'
  },
  content: {
    required: true,
    type: String
  },
})

const html = ref('')

onMounted(async () => {
  // console.debug({
  //   'lang': props.lang,
  //   'content': props.content,
  // })

  // noinspection JSUnresolvedReference,JSCheckFunctionSignatures
  codeToHtml(props.content, {
    lang: props.lang,
    themes: {
      dark: import.meta.env.VITE_SHIKI_THEME_DARK,
      light: import.meta.env.VITE_SHIKI_THEME_LIGHT,
    }
  }).then((res) => {
    // console.debug(html)
    html.value = res
  })
});


</script>

<template>
  <div class="codeCard">
    <div class="codeCard__header">
      <el-text >
        {{ props.lang }}
      </el-text>
      <el-button link >
<!--        todo: 复制还没写-->
        <el-icon style="margin-right: 2px">
          <CopyDocument style="transform: scale(1.1)"/>
        </el-icon>
        Copy code
      </el-button>
    </div>
    <div class="codeCard__code">
      <div v-html="html" class="codeCard__Mask"/>
    </div>
  </div>
</template>

<style lang="scss">
// 用于切换shiKi黑白主题
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
</style>

<style scoped lang="scss">
// todo: 代码块待调试，仍无法随页面缩放
.codeCard {
  box-shadow: var(--el-box-shadow-lighter);
  word-wrap: break-word;

  //width: auto;
  //max-width: 100%;

  overflow-x: auto;
  position: relative;

  .codeCard__header {
    border-radius: .375rem .375rem 0 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;

    :deep(span){
      font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
      'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: rgb(197, 197, 210);
    }


    position: relative;
    background-color: rgba(147,147,147,0.4);
  }

  .codeCard__code {
    :deep(pre) {
      //max-width: 100%;
      //width: 100%;
      border-radius: 0 0 .375rem .375rem;
      //overflow-y: auto;

      overflow-x: auto;
      position: relative;

      direction: ltr;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;


      //white-space: nowrap;
      display: block;
      margin: 0;
      box-sizing: border-box;
      //noinspection CssInvalidPropertyValue
      text-wrap: nowrap;

      code {
        display: block;
        width: fit-content;
        min-width: 100%;

        direction: ltr;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
      }
    }
  }
}


</style>