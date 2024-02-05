<script setup>
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {ArrowDown, ArrowUp, Avatar, User} from "@element-plus/icons-vue";

const props = defineProps({
  chatType: {
    required: true,
    type: String,
    validator(value) {
      // The value must match one of these strings
      return ['assistant', 'user', 'system'].includes(value)
    }
  },
  userName: {
    required: false,
    type: String,
    default: 'You'
  },
  message: {
    required: true,
    type: String
  },
  showSystem: {
    required: false,
    type: Boolean,
    default: false
  }
});

const isDefaultUser = props.chatType === 'user' && props.userName && props.userName === 'You'
const showSystemLine = ref(1)
</script>

<template>
  <div class="chatCard">
    <div class="chat__system" v-if="props.chatType === 'system' && props.showSystem">
      <el-button class="chat__systemFlexBox" size="small" link
                 @click="() => { showSystemLine=showSystemLine === 1 ? 99 : 1; }">
        <el-icon v-if="showSystemLine === 1"><ArrowDown /></el-icon>
        <el-icon v-else><ArrowUp /></el-icon>
        <el-text type="info" :line-clamp="showSystemLine" translate class="chat__systemText">
          {{ props.message}}
        </el-text>
      </el-button>
    </div>
    <div class="chat__inner" v-else-if="props.chatType !== 'system'">
      <div class="chat__avatar">
        <el-avatar size="small">
          <el-icon>
            <User v-if="isDefaultUser" />
            <template v-else-if="props.chatType === 'user'">
              {{ props.userName.slice(0, 2).toUpperCase() }}
            </template>
            <Avatar v-else />
          </el-icon>
        </el-avatar>
      </div>
      <div class="chat__messageBox">
        <div class="chat__userName">
          {{ props.chatType === 'user' ? props.userName : 'Bot' }}
        </div>
        <MarkdownRenderer :content="props.message" :chatType="props.chatType"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chatCard {
  padding: 8px 16px;
  margin: 0 auto;

  width: 100%;
  max-width: calc(48rem + 40px);

  .chat__system {
    font-size: 0.75rem;
    color: var(--el-text-color-disabled);

    .chat__systemFlexBox {
      display: block;
      margin: 0 auto;
      width: 100%;
      max-width: 60%;

      :deep(span) {
        align-items: flex-start;

        .chat__systemText {
          text-align: left;
          margin-left: 5px;
          overflow: hidden;
          white-space: pre-wrap;
        }
      }
    }
  }

  .chat__inner {
    padding: 0 20px;
    width: 100%;
    max-width: 48rem;
    display: flex;
    flex-direction: row;
    gap: 0.75rem;

    .chat__avatar {
      display: flex;
      flex-direction: column;
      justify-content: start;
      span{
        font-size: var(--el-font-size-small);
      }
    }

    .chat__messageBox {
      width: calc(100% - 115px);

      display: flex;
      flex-direction: column;

      position: relative;
      box-sizing: border-box;


      .chat__userName {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 600;
      }
    }
  }
}
</style>
