<script setup>
import md from '@/markdown/index.js';
import {Avatar, User} from "@element-plus/icons-vue";

const props = defineProps({
  chatType: {
    required: true,
    type: String
  },
  userName: {
    required: false,
    type: String,
    default: 'You'
  },
  message: {
    required: true,
    type: String
  }
});

</script>

<template>
  <div class="chatCard">
    <div class="chat__inner">
      <div class="chat__avatar">
        <el-avatar size="small">
          <el-icon>
            <User v-if="props.chatType === 'user' && props.userName && props.userName === 'You'" />
            <template v-else-if="props.chatType === 'user'">{{ props.userName.slice(0, 2).toUpperCase() }}</template>
            <Avatar v-else />
          </el-icon>
        </el-avatar>
      </div>
      <div class="chat__messageBox">
        <div class="chat__userName">{{ props.chatType === 'user' ? props.userName : 'Bot' }}</div>
        <div class="chat__message" v-if="props.chatType === 'user'">{{ props.message }}</div>
<!--        <div class="chat__message" v-else v-html="dynamicMessages()" />-->
        <div class="chat__message" v-else v-html="md.render(props.message)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chatCard {
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  flex-direction: row;

  .chat__inner {
    padding: 0 20px;
    max-width: 750px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.75rem;

    .chat__avatar {
      display: flex;
      flex-direction: column;
      justify-content: start;
    }

    .chat__messageBox {
      display: flex;
      flex-direction: column;
      justify-content: left;
      word-wrap: break-word;

      .chat__userName {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 600;
      }

      .chat__message {
        font-size: 1rem;
        line-height: 1.5rem;
      }
    }
  }
}
</style>

