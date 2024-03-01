<script lang="ts" setup>
/* 创建文件展示列表 */
import {CircleCloseFilled} from "@element-plus/icons-vue";

export interface FilePreviewRaw {
  raw: File,
  url: string;
}

interface propsType {
  fileList: FilePreviewRaw[];
  showRemove?: boolean;
}

const props = withDefaults(
  defineProps<propsType>(), {
    showRemove: false
  }
);

const emit = defineEmits<{
  (e: 'removeBtnClick', index: number): void;
}>();

const previewSrcList = computed(() => {
  return props.fileList.map((item) => item.url);
});

</script>

<template>
  <div class="content">
    <div v-for="({url, raw}, index) in props.fileList" class="fileBox">
      <div class="fileCard">
        <el-image :infinite="false" :initial-index="index" :preview-src-list="previewSrcList" :src="url"
                  class="viewIcon" fit="fill" loading="lazy"/>
        <div class="fileInfo">
          <el-text class="fileName" size="small" truncated>{{ raw.name }}</el-text>
          <div class="fileInfo__main">
            <el-text class="fileInfo__type" size="small" type="info">{{ raw.type.split('/')[1].toUpperCase() }}
            </el-text>
            <el-text class="fileInfo__size" size="small" type="info">{{ (raw.size / (1024 * 1024)).toFixed(2) }} MB
            </el-text>
          </div>
        </div>
        <el-button v-if="props.showRemove" class="removeItem" link @click="emit('removeBtnClick', index)">
          <el-icon size="14">
            <CircleCloseFilled/>
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  align-items: flex-end;
  gap: 0.5rem;

  padding: 5px;
  height: 100%;

  overflow-y: auto;
  overflow-x: hidden;

  .fileCard {
    max-height: 50px;
    position: relative;

    box-sizing: border-box;
    border: grey 1px solid;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-lighter);

    padding: 8px;

    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 10px;

    .viewIcon {
      border-radius: 8px;

      height: 35px;
      width: 35px;
    }

    .fileInfo {
      max-width: 130px;
      min-width: 100px;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .fileName {
        width: 100%;
      }

      .fileInfo__main {
        display: flex;
        flex-direction: row;
        gap: 10px;
      }
    }

    .removeItem {
      position: absolute;
      top: -8px;
      right: -8px;
    }
  }
}
</style>