<script setup lang="ts">
// import DB from '@/tools/db.ts';
import Config from "@/components/ConfigSpark.vue";
import ChatCard from "@/components/ChatCard.vue"
import {DocumentAdd, Promotion, Refresh} from "@element-plus/icons-vue";
import {listModels} from "@/network/OpenaiApi"
import {openaiChatCompletionRequestMessages} from "@/types/OpenaiAPITypes";

const modelName: Ref<string> = ref('');
let modelList: {label: string; value: string}[] = []
const showConfig: Ref<boolean> = ref(false)
const inputValue: Ref<string> = ref('hello')

interface messagesListType extends openaiChatCompletionRequestMessages{
  userName?: string;
}

const messagesList: Ref<messagesListType[]> = ref([
  { role: 'system', userName: 'system', content: 'You are a helpful assistant.'},
  { role: 'user', content: 'Give me some python Example' },
  { role: 'assistant', userName: 'Bot', content: 'Sure\n```python\ndoc.sections[0].page_height = Cm(29.7)\n```' },
])


async function updateApiCredentials() {
//   OpenAI_DB.getItem("apiCredentials").then((res) => {
//     apiCredentials.value = res
//     console.debug(apiCredentials.value)
//   })
//   showConfig.value = false
}

function submitMessage() {
  // todo: 待封装相关请求函数
  // messagesList.value.push({ role: 'user', content: inputValue.value })

  // inputValue.value = ''
}

const baseURL = "https://u23218-b635-989ec868.beijinga.seetacloud.com/"

onBeforeMount(() => {
  nextTick(async () => {
    modelList = (await listModels(baseURL)).map(item => {return {label: item, value: item}})
    modelName.value = modelList[0].value
    // console.log(modelList)
    // console.log(modelList)
    // await createCompletion(baseURL, [{"role": "user", "content": "hello"}],
    //   "google/gemma-7b-it", {stream: false})
  })
})
</script>

<template>
  <div class="content">
    <Config v-if="showConfig" :submitCallable="updateApiCredentials"/>
    <div class="main">
      <div class="header">
        <el-select v-model="modelName" placeholder="Model" >
          <el-option v-for="item in modelList" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="conversations">
        <template v-for="{content, role, userName} in messagesList">
          <ChatCard :role="role" :content="content" :userName="userName"/>
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
          <el-button type="info" size="large" link class="refreshBtn" @click="() => {messagesList = [messagesList[0]]}">
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
          <el-button class="submitBtn"  @click="submitMessage()" :disabled="!(inputValue.length > 0)">
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

  .main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .header {
      padding: 8px;
      display: flex;
      flex-direction: row;
      :deep(.el-select__wrapper){
        box-shadow: none;

        font-size: 18px;
        font-weight: 500;
      }
    }

    .conversations{
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