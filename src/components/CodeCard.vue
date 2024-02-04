<script setup>
import { codeToHtml } from 'shiki/bundle/full'
import { useClipboard } from '@vueuse/core'
import { CopyDocument } from "@element-plus/icons-vue";

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
  themes: {
    required: false,
    type: Object,
    default: () => ({
      dark: import.meta.env.VITE_SHIKI_THEME_DARK,
      light: import.meta.env.VITE_SHIKI_THEME_LIGHT,
    })
  }
})

const html = ref('')
const copyCodeBtnText = ref('Copy code')

onMounted(async () => {
  // console.debug({ 'lang': props.lang, 'content': props.content, })

  // noinspection JSUnresolvedReference,JSCheckFunctionSignatures
  codeToHtml(props.content, {
    lang: props.lang,
    themes: props.themes
  }).then((res) => {
    html.value = res
  })
});

const { text, copy, copied, isSupported } = useClipboard()

function copyCode() {
  if (isSupported) {
    if (props.content.length === 0) {
      ElMessage({
        message: 'No code to copy',
        type: 'warning'
      })
    } else {
      copy(props.content)
      if(copied){
        console.debug(`Copied to clipboard: ${props.content}`)
        copyCodeBtnText.value = 'Copied'
        setTimeout(() => {
          copyCodeBtnText.value = 'Copy code'
        }, 1000)
      }
    }
  } else {
    ElMessage({
      message: 'Your browser does not support copying',
      type: 'error'
    })
  }
}

</script>

<template>
  <div class="codeCard">
    <div class="codeCard__header">
      <el-text >
        {{ props.lang }}
      </el-text>
      <el-button link @click="() => {copyCode()}" :disabled="copyCodeBtnText === 'Copied'">
        <el-icon style="margin-right: 3px">
          <CopyDocument style="transform: scale(1.1)"/>
        </el-icon>
        {{ copyCodeBtnText }}
      </el-button>
    </div>
    <div class="codeCard__code" v-html="html" />
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
.codeCard {
  box-shadow: var(--el-box-shadow-lighter);
  word-wrap: break-word;

  position: relative;

  display: flex;
  flex-direction: column;

  border-radius: .375rem;
  background-color: rgba(147,147,147,0.4);

  .codeCard__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;

    :deep(span) {
      font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
      'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: var(--el-text-color);
    }
  }


  .codeCard__code {
    :deep(pre) {
      min-width: 100%;
      width: 5vw;
      overflow: auto;

      border-radius: 0 0 .375rem .375rem;
      box-sizing: border-box;
      margin: 0;
    }
  }
}
</style>