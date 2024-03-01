<script lang="ts" setup>
// import DB from '@/tools/db.ts';
// import Config from "@/components/ConfigSpark.vue";
import Config from "@/components/ConfigOpenai.vue";
import type {ChatCardProps} from "@/components/ChatCard.vue"
import ChatCard from "@/components/ChatCard.vue"
import type {FilePreviewRaw} from "@/components/FilePreview.vue";
import FilePreview from "@/components/FilePreview.vue";
import {DocumentAdd, Promotion, Refresh, Share} from "@element-plus/icons-vue";
import {createChatCompletion, listModels} from "@/network/OpenaiApi"
import type {openaiChatCompletionRequestMessagesContent} from "@/types/OpenaiAPI";
import type {UploadInstance, UploadRequestOptions} from "element-plus";
import {useThrottleFn} from '@vueuse/core'
import {getBase64} from "@/tools/base64";
import {convertUnixTimeToFormattedTime, getCurrentFormattedTime} from "@/tools/nowTime";

const modelName = ref<string>('');
const modelList = reactive<{ label: string; value: string }[]>([])
const showConfig = ref<boolean>(false)

// todo: move to a config component
const baseURL = "https://u23218-bcf9-65e4e0f6.westx.seetacloud.com:8443/"

// 获取模型列表
onMounted(() => {
  nextTick(async () => {
    (await listModels(baseURL)).map(item => {
      modelList.push({label: item.split('/')[1], value: item})
    })
    modelName.value = modelList[0]?.value
  })
});

// 滚动到底部
onUpdated(useThrottleFn(() => {
  const chatCard = document.querySelector('.conversations')
  if (chatCard) {
    chatCard.scrollTop = chatCard.scrollHeight
  }
}, 3000));

// to PromptArea.vue
const inputValue = ref<string>('what in this picture?');
const submitLoading = ref<boolean>(false);

interface ChatMessagesList extends ChatCardProps {
  content: string | openaiChatCompletionRequestMessagesContent[];
}

const messagesList = ref<ChatMessagesList[]>([]);

function handleEnterKey(event: KeyboardEvent) {
  // 支持 ctrl + enter 换行
  if (event.ctrlKey && event.target instanceof HTMLTextAreaElement) {
    // 在当前光标位置插入一个新行字符
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    inputValue.value = inputValue.value.substring(0, start) + "\n" + inputValue.value.substring(end);
    // 将光标移动到插入的新行字符之后
    setTimeout(() => {
      if (event.target instanceof HTMLTextAreaElement) {
        event.target.selectionStart = event.target.selectionEnd = start + 1;
      }
    }, 0);
  } else {
    // 输入内容非空或全为\n
    if (inputValue.value.trim() !== '' && !inputValue.value.match(/^\n+$/)) {
      submitMessage()
    }
  }
}


async function createMessageContent(query: string, fileList?: FilePreviewRaw[]): Promise<
  string | openaiChatCompletionRequestMessagesContent[]
> {
  // todo: support more file types
  if (fileList && fileList.length) {
    const base64List: openaiChatCompletionRequestMessagesContent[] = []
    // add img_b64
    fileList.map(file => base64List.push({type: "image_url", image_url: {url: file.url}}))
    // add text
    base64List.push({type: "text", text: query})
    return base64List
  }
  return query
}


async function submitMessage() {
  // 组装 content 并推送到 messagesList
  const content = await createMessageContent(inputValue.value, uploadFileList.value)
  console.debug(`content: `, content)
  messagesList.value.push({
    role: 'user',
    content: content,
    text: inputValue.value,
    fileList: [...uploadFileList.value],
    time: getCurrentFormattedTime()
  })

  // 清理
  uploadFileList.value.length = 0
  uploadRef.value?.clearFiles()
  inputValue.value = ''

  // 开始请求
  submitLoading.value = true

  // clone messagesList
  const messagesWithoutPlaceholder = [...messagesList.value];

  // 添加占位符到 messagesList
  const placeholderIndex = messagesList.value.push({content: '', role: 'assistant', loading: true, text: ""}) - 1;

  try {
    // 执行请求，使用不包含占位符的副本
    const response = await createChatCompletion(baseURL, messagesWithoutPlaceholder, modelName.value, {stream: false});

    let placeholder = messagesList.value[placeholderIndex];
    placeholder.loading = false;

    const responseText = response?.choices[0]?.message?.content;
    placeholder.time = convertUnixTimeToFormattedTime(response?.created)
    placeholder.content = responseText ?? "Error: No response";
    placeholder.text = responseText ?? "Error: No response";

  } catch (error) {
    console.error("Error submitting message:", error);
    // 错误处理，可以选择更新占位符显示错误信息或移除占位符
    messagesList.value[placeholderIndex].loading = false
    messagesList.value[placeholderIndex].requestError = true
  } finally {
    // 无论成功还是失败，都需要停止加载状态
    submitLoading.value = false;
  }
}

function refreshMessages() {
  messagesList.value.length = messagesList.value[0]?.role === 'system' ? 1 : 0
  uploadFileList.value.length = 0
  uploadRef.value?.clearFiles()
}


// to UploadBtn.vue
const uploadRef = ref<UploadInstance>()
const uploadFileList = ref<FilePreviewRaw[]>([])

function UploadRequest(options: UploadRequestOptions) {
  console.debug(`Upload File: ${options.file.name}`)
  // todo: support more file types
  getBase64(options.file).then(base64 => {
    uploadFileList.value.push({raw: options.file, url: base64})
  })
}

function removeUploadItem(index: number) {
  uploadFileList.value.splice(index, 1)
}

</script>

<template>
  <div class="content">
    <Config v-if="showConfig"/>
    <div class="main">
      <div class="header">
        <el-select v-model="modelName" placeholder="Model">
          <el-option v-for="item in modelList" :key="item.label" :label="item.label" :value="item.value"/>
        </el-select>
        <el-button disabled>
          <el-icon>
            <Share style="transform: scale(1.2);"/>
          </el-icon>
        </el-button>
      </div>
      <div class="conversations">
        <template v-for="{role, userName, loading, text, fileList, requestError, time} in messagesList">
          <ChatCard :file-list="fileList" :loading="loading" :request-error="requestError" :role="role"
                    :text="text" :time="time" :user-name="userName"/>
        </template>
      </div>
      <div class="inputArea">
        <FilePreview v-if="uploadFileList.length" :file-list="uploadFileList" class="filePreview"
                     show-remove @removeBtnClick="removeUploadItem"/>
        <div class="rowTools">
          <el-upload
            ref="uploadRef"
            :accept="`.jpg, .jpeg, .png, .webp, .bmp`"
            :http-request="UploadRequest"
            :limit="10"
            :multiple="true"
            :show-file-list="false"
            action="#"
            class="uploadMain"
          >
            <el-button class="uploadBtn" link size="large" type="info">
              Select Files
              <el-icon style="margin-left: 5px">
                <DocumentAdd style="transform: scale(1.2);"/>
              </el-icon>
            </el-button>
          </el-upload>
          <el-button class="refreshBtn" link size="large" type="info" @click="refreshMessages">
            New Chat
            <el-icon style="margin-left: 5px">
              <Refresh style="transform: scale(1.2);"/>
            </el-icon>
          </el-button>
        </div>
        <div class="rowInput">
          <el-input v-model="inputValue" :autosize="{ minRows: 1, maxRows: 6 }" class="inputText"
                    maxlength="4000" placeholder="Please type here" show-word-limit
                    type="textarea" @keyup.enter.native="handleEnterKey"
          />
          <el-button :disabled="!(inputValue.length > 0) || submitLoading" class="submitBtn" @click="submitMessage">
            <el-icon>
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

<style lang="scss" scoped>
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
      justify-content: space-between;

      margin: 0 auto;
      flex-grow: 0;

      min-width: 200px;
      width: 100%;
      max-width: 770px;

      :deep(.el-select__wrapper) {
        box-shadow: none;
        //max-width: 200px;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .conversations {
      width: 100%;
      flex-grow: 1;

      overflow-y: auto;
      overflow-x: hidden;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .inputArea {
      margin: 10px 15px 15px 15px;

      flex-basis: 80px;

      display: flex;
      flex-direction: column;
      align-items: center;

      .filePreview {
        min-width: 200px;
        width: 100%;
        max-width: 770px;

        flex-grow: 1;
        flex-basis: 60px;
        max-height: 120px;
      }

      .rowTools {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin: 0 5px 0 5px;

        min-width: 200px;
        width: 100%;
        max-width: 770px;

        .uploadBtn {
          font-size: 15px;
        }

        .refreshBtn {
          font-size: 15px;
        }
      }

      .rowInput {
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

        .inputText {
          :deep(.el-textarea__inner) {
            border-radius: 10px;
            resize: none;
            border: none;
            font-size: 16px;
            font-weight: 400;
            box-shadow: none;
          }
        }

        .submitBtn {
          height: 34px;
          margin: 0 0 0 5px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>