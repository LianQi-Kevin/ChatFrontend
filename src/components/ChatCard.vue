<script lang="ts" setup>
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {ArrowDown, ArrowUp, Avatar, User, WarningFilled} from "@element-plus/icons-vue";
import type {FilePreviewRaw} from "@/components/FilePreview.vue";
import FilePreview from "@/components/FilePreview.vue";

export interface ChatCardProps {
  role: "assistant" | "user" | "system";  // 角色
  text: string; // 消息内容
  time?: string; // 时间截
  fileList?: FilePreviewRaw[]; // 文件列表
  userName?: string;
  showSystem?: boolean;
  loading?: boolean;
  requestError?: boolean;
  onError?: Function; // Retry btn 回调
}

const props = withDefaults(defineProps<ChatCardProps>(), {
  userName: "You",
  showSystem: false,
  loading: false,
  requestError: false,
});

// 是否是默认用户名
const isDefaultUser: boolean = !!(props.role === 'user' && props.userName && props.userName === 'You')
const showSystemLine = ref<number>(1)
</script>

<template>
  <div class="chatCard">
    <div v-if="props.role === 'system' && props.showSystem" class="chat__system">
      <el-button class="chat__systemFlexBox" link size="small"
                 @click="() => { showSystemLine=showSystemLine === 1 ? 99 : 1; }">
        <el-icon v-if="showSystemLine === 1">
          <ArrowDown/>
        </el-icon>
        <el-icon v-else>
          <ArrowUp/>
        </el-icon>
        <el-text :line-clamp="showSystemLine" class="chat__systemText" translate type="info">
          {{ props.text }}
        </el-text>
      </el-button>
    </div>
    <div v-else-if="props.role !== 'system'" class="chat__inner">
      <div class="chat__avatar">
        <el-avatar size="small">
          <el-icon>
            <User v-if="isDefaultUser"/>
            <template v-else-if="props.role === 'user'">
              {{ props.userName.slice(0, 2).toUpperCase() }}
            </template>
            <Avatar v-else/>
          </el-icon>
        </el-avatar>
      </div>
      <div class="chat__messageBox">
        <div class="chat__mainTitle">
          <el-text size="large" tag="b">
            {{ props.role === 'user' ? props.userName : 'Bot' }}
          </el-text>
          <el-text class="chat__titleTime" size="default" type="info">
            {{ props.time }}
          </el-text>
        </div>
        <div v-if="props.loading" id="chat__loading" style="margin-top: 10px; margin-left: 5px;width: 20px"/>
        <FilePreview v-if="props.fileList && props.fileList.length && !props.requestError" :file-list="props.fileList" :in-chat="true"/>
        <MarkdownRenderer v-if="!props.loading && !props.requestError" :content="props.text" :role="props.role"/>

        <div v-if="props.requestError">
          <el-button :icon="WarningFilled" plain style="margin-top: 10px" type="danger" @click="props.onError">
            Retry
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

      span {
        font-size: var(--el-font-size-small);
      }
    }

    .chat__messageBox {
      width: calc(100% - 115px);

      display: flex;
      flex-direction: column;

      position: relative;
      box-sizing: border-box;

      .chat__mainTitle {
        .chat__titleTime {
          margin-left: 10px;
        }
      }
    }
  }
}

#chat__loading {
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(0deg, var(--el-text-color-primary), var(--el-text-color-primary));
  background: var(--c) 0 50%,
  var(--c) 50% 50%,
  var(--c) 100% 50%;
  background-size: 20% 100%;
  animation: l1 1s infinite linear;
}

@keyframes l1 {
  0% {
    background-size: 20% 100%, 20% 100%, 20% 100%
  }
  33% {
    background-size: 20% 10%, 20% 100%, 20% 100%
  }
  50% {
    background-size: 20% 100%, 20% 10%, 20% 100%
  }
  66% {
    background-size: 20% 100%, 20% 100%, 20% 10%
  }
  100% {
    background-size: 20% 100%, 20% 100%, 20% 100%
  }
}
</style>
