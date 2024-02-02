<script setup>
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import {Avatar, User} from "@element-plus/icons-vue";

const props = defineProps({
  chatType: {
    required: true,
    type: String,
    validator(value) {
      // The value must match one of these strings
      return ['bot', 'user'].includes(value)
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
  }
});

const isDefaultUser = props.chatType === 'user' && props.userName && props.userName === 'You'

</script>

<template>
  <div class="chatCard">
    <div class="chat__inner">
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
