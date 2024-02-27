<script setup lang="ts">
import {DocumentAdd} from "@element-plus/icons-vue";
import type {UploadInstance, UploadProps, UploadRawFile, UploadRequestOptions } from "element-plus";

const uploadRef = ref<UploadInstance>()
const uploadFileList = reactive<UploadRawFile[]>([])

function BeforeUpload(options: UploadRequestOptions) {
  console.log('BeforeUpload')
  uploadFileList.push(options.file)
  // uploadRef.value?.abort()

  console.log(uploadFileList)
}

</script>

<template>
  <div class="content">
    <el-upload
      action="#"
      class="uploadMain"
      ref="uploadRef"
      :multiple="true"
      :show-file-list="false"
      :accept="`.jpg, .jpeg, .png, .webp, .bmp`"
      :limit="5"
      :before-upload="BeforeUpload"
    >
      <el-button type="info" size="large" link class="uploadBtn">
        Select Files
        <el-icon style="margin-left: 5px" >
          <DocumentAdd style="transform: scale(1.2);"/>
        </el-icon>
      </el-button>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.content {
  max-height: 30px;

  .uploadMain {
    .uploadBtn {
      font-size: 15px;
    }
  }
}
</style>