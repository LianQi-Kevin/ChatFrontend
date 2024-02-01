<!--suppress ALL -->
<script setup>
import md from '@/tools/markdown.js'
import "github-markdown-css/github-markdown.css";
import CodeCard from '@/components/CodeCard.vue'

const props = defineProps({
  content: String,
});

const codeBlocksContainer = ref(null);

onMounted(async () => {
  await nextTick(); // 确保 markdown-it 渲染的内容已经插入 DOM

  const codeBlocks = codeBlocksContainer.value.querySelectorAll('pre[id="codeSpace"]');

  codeBlocks.forEach(block => {
    const code = block.querySelector('code[class*="language-"]');
    if (code) {
      const content = code.textContent;
      // 使用默认值 'plaintext' 如果没有找到语言类
      const lang = code.className.replace('language-', '') || 'plaintext';

      // 创建 CodeCard 实例并替换当前的 pre 元素
      // 传递 lang, content, 以及 theme (如果需要的话)
      const codeCardInstance = createApp(CodeCard, { lang, content });
      const mountNode = document.createElement('div');
      block.replaceWith(mountNode);
      codeCardInstance.mount(mountNode);
    }
  });
});

</script>

<template>
  <div style="gap: 0.75rem; flex-direction: column; box-sizing: border-box; display: block">
    <div class="flexBox">
      <article class="markdown-body" ref="codeBlocksContainer">
        <div v-html="md.render(props.content)" class="markdown"/>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flexBox{
  max-width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .markdown-body {
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-x: auto;
    gap: 0.75rem;
    align-items: flex-start;
    min-height: 20px;
    flex-direction: column;
    display: flex;

    box-sizing: border-box;

    background: 0;
    color: var(--el-text-color);

    .markdown {
      max-width: none;
      word-wrap: break-word;
      width: 100%;
    }
  }
}
</style>
