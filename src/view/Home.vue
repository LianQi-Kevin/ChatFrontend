<script setup>
import DB from '@/tools/db.js';
import Config from "@/components/Config.vue";
import ChatSidebar from "@/components/ChatSidebar.vue";
import ChatCard from "@/components/ChatCard.vue"
import {DocumentAdd, Promotion, Refresh} from "@element-plus/icons-vue";

const apiCredentials = ref()
const modelName = ref('')
const showConfig = ref(false)
const inputValue = ref('')

const messagesList = ref([
  { chatType: 'user', userName: 'allEN', message: 'Hello' },
  {
    chatType: 'bot',
    userName: 'Bot',
    message: '### hello\n\n- 1\n- 2\n- 3\n\n```python\nprint("hello")\n```\n\n[百度](https://www.baidu.com)'
  },
])

onBeforeMount(async () => {
  apiCredentials.value = await DB.getItem("apiCredentials")
  modelName.value = `讯飞星火认知大模型 ${apiCredentials.value ? apiCredentials.value['APIVersion'] : ''}`
});

onMounted(() => {
  // modelName.value = `讯飞星火认知大模型`
})

async function updateApiCredentials() {
  DB.getItem("apiCredentials").then((res) => {
    apiCredentials.value = res
    console.debug(apiCredentials.value)
  })
  showConfig.value = false
}
</script>

<template>
  <div class="content">
    <Config v-if="showConfig" :submitCallable="updateApiCredentials"/>
    <div class="sidebar" v-if="false">
      <ChatSidebar :userid="''" :model-name="modelName" />
    </div>
    <div class="main">
      <div class="header" v-if="false">
        <el-text class="modelName">{{ modelName }}</el-text>
      </div>
      <div class="conversations">
        <template v-for="item in messagesList">
          <ChatCard :chat-type="item.chatType" :message="item.message" :userName="item.userName"/>
        </template>
      </div>
      <div class="inputArea">
        <div class="rowTools">
          <el-button type="info" size="large" link class="uploadBtn">
            Upload Files
            <el-icon style="margin-left: 5px" >
              <DocumentAdd style="transform: scale(1.2);"/>
            </el-icon>
          </el-button>
          <el-button type="info" size="large" link class="refreshBtn">
            New Chat
            <el-icon style="margin-left: 5px" >
              <Refresh style="transform: scale(1.2);"/>
            </el-icon>
          </el-button>
        </div>
        <div class="rowInput">
          <el-input
            class="inputText"
            placeholder="Please type here"
            show-word-limit
            maxlength="4000"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            v-model="inputValue"
            size="large"
          />
          <el-button
            size="large"
            class="submitBtn"
            circle
          >
            <el-icon >
              <Promotion style="transform: scale(1.5);"/>
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// 覆盖全局滚动条样式（仿 el-scrollbar）
::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--el-scrollbar-bg-color, var(--el-text-color-secondary));
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}
</style>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;

  .sidebar {
    flex-basis: 260px;
    flex-grow: 0;

    background: var(--el-fill-color-extra-light);
  }

  .main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    background: var(--el-fill-color-light);

    //.header{
    //  position: absolute;
    //  top: 0;
    //  height: 50px;
    //  width: calc(100% - 260px);
    //
    //  background: rgba(80, 80, 80, 0.7);
    //  -webkit-backdrop-filter: blur(10px);
    //  backdrop-filter: blur(10px);
    //}

    .conversations{
      margin-top: 25px;

      width: 100%;
      flex-grow: 1;

      overflow-y: auto;
    }


    .inputArea{
      margin:  10px 15px 15px 15px;

      flex-grow: 0;
      flex-basis: 110px;

      .rowTools{
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin: 0 5px 0 5px;

        .uploadBtn{
          font-size: 15px;
        }

        .refreshBtn{
          font-size: 15px;
        }
        //margin: 0 15px 0 15px;
      }

      .rowInput{
        margin-top: 10px;

        background: rgba(128, 128, 128, 0.5);
        border-radius: 10px;

        display: flex;
        flex-direction: row;
        align-items: end;

        padding: 10px;

        .inputText{
          :deep(.el-textarea__inner){
            border-radius: 10px;
            resize: none;
            border: none;
            font-size: 16px;
            font-weight: 400;
          }
        }

        .submitBtn{
          margin: 0 0 0 15px ;
        }
      }
    }
  }
}
</style>