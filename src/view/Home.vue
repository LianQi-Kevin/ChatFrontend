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
  { chatType: 'system', userName: 'system', message: 'You are a helpful assistant.', showSystem: true },
  { chatType: 'user', userName: 'allEN', message: 'Give me some python Example' },
  { chatType: 'assistant', userName: 'Bot', message: 'Sure\n```python\ndoc.sections[0].page_height = Cm(29.7)\n```' },
])

onBeforeMount(async () => {
  apiCredentials.value = await DB.getItem("apiCredentials")
  modelName.value = `讯飞星火认知大模型 ${apiCredentials.value ? apiCredentials.value['APIVersion'] : ''}`
});

async function updateApiCredentials() {
  DB.getItem("apiCredentials").then((res) => {
    apiCredentials.value = res
    console.debug(apiCredentials.value)
  })
  showConfig.value = false
}

function submitMessage() {
  console.debug(inputValue.value)
  // todo: 待封装相关请求函数
  messagesList.value.push({ chatType: 'user', userName: 'You', message: inputValue.value })
  inputValue.value = ''
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
          <ChatCard :chatType="item.chatType" :message="item.message" :userName="item.userName" :showSystem="item.showSystem"/>
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
          <el-button type="info" size="large" link class="refreshBtn" @click="() => {messagesList = []}">
            New Chat
            <el-icon style="margin-left: 5px" >
              <Refresh style="transform: scale(1.2);"/>
            </el-icon>
          </el-button>
        </div>
        <div class="rowInput">
          <el-input class="inputText" placeholder="Please type here" v-model="inputValue"
            maxlength="4000" :autosize="{ minRows: 1, maxRows: 6 }" type="textarea"
            show-word-limit
          />
          <el-button class="submitBtn"  @click="submitMessage()" :disabled="!inputValue.length > 0">
            <el-icon >
              <Promotion style="transform: scale(1.3);"/>
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

    .conversations{
      margin-top: 25px;

      width: 100%;
      flex-grow: 1;

      overflow-y: auto;
      overflow-x: hidden;

      display: flex;
      flex-direction: column;
      align-items: center;
    }


    .inputArea{
      margin:  10px 15px 15px 15px;

      flex-grow: 0;
      flex-basis: 80px;

      display: flex;
      flex-direction: column;
      align-items: center;


      .rowTools{
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin: 0 5px 0 5px;

        min-width: 200px;
        width: 100%;
        max-width: 770px;

        .uploadBtn{
          font-size: 15px;
        }

        .refreshBtn{
          font-size: 15px;
        }
      }

      .rowInput{
        margin-top: 10px;

        border: 1px solid var(--el-box-shadow);
        box-shadow: var(--el-box-shadow);

        border-radius: 10px;

        display: flex;
        flex-direction: row;
        align-items: end;

        padding: 10px;

        min-width: 200px;
        width: 100%;
        max-width: 770px;

        .inputText{
          :deep(.el-textarea__inner){
            border-radius: 10px;
            resize: none;
            border: none;
            font-size: 16px;
            font-weight: 400;
            box-shadow: none;
          }
        }

        .submitBtn{
          height: 34px;
          margin: 0 0 0 5px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>