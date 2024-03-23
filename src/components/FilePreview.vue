<script lang="ts" setup>
/* 创建文件展示列表 */
import {CircleCloseFilled, Document, Film} from "@element-plus/icons-vue";
import {formatFileSize} from "@/tools/fileTools";

export interface FilePreviewRaw {
  xhr?: XMLHttpRequest,
  raw: File,
  uid: number,
  url?: string,
  b64?: string,
  progress?: number,
  status?: 'success' | 'warning' | 'exception'
}

interface propsType {
  fileList: FilePreviewRaw[];
  showRemove?: boolean;
  inChat?: boolean;
}

const props = withDefaults(
  defineProps<propsType>(), {
    showRemove: false,
    inChat: false
  }
);

const emit = defineEmits<{
  (e: 'removeBtnClick', index: number, xhr: XMLHttpRequest | undefined): void;
}>();

const previewSrcList = computed(() => {
  return props.fileList.map((item) => item.b64);
});

</script>

<template>
  <div class="content">
    <template v-for="({raw, progress, status, b64, xhr}, index) in props.fileList">
      <template v-if="props.inChat && raw.type.includes('image')">
        <el-image :infinite="false" :initial-index="index" :preview-src-list="previewSrcList" :src="b64"
                  class="viewIcon__InChat" fit="cover" loading="lazy"/>
      </template>
      <div class="imageCard" v-else-if="raw.type.includes('image')" >
        <el-image :infinite="false" :initial-index="index" :preview-src-list="previewSrcList" :src="b64"
                  class="viewIcon" fit="cover" loading="lazy" v-if="!props.inChat"/>
        <el-button v-if="props.showRemove" class="removeItem" link @click="emit('removeBtnClick', index, xhr)">
          <el-icon size="16">
            <CircleCloseFilled/>
          </el-icon>
        </el-button>
        <el-progress class="imageCard__progress" :percentage="progress" striped striped-flow :duration="5"
                     type="circle" :width="40" :stroke-width="4" :text-inside="false" :status="status"
                     v-if="!(progress == 100 || !progress)">
          <template />
        </el-progress>
      </div>
      <div class="fileBox" v-else >
        <div class="fileCard">
          <el-icon class="viewIcon" v-if="raw.type.includes('video')" size="33"><Film /></el-icon>
          <el-icon class="viewIcon" v-else size="33"><Document /></el-icon>
          <div class="fileInfo" >
            <el-text class="fileName" size="small" truncated>{{ raw.name }}</el-text>
            <div class="fileInfo__main" v-if="progress == 100 || !progress">
              <el-text class="fileInfo__type" size="small" type="info">
                {{ raw.name.split('.')[raw.name.split('.').length - 1].toUpperCase() }}
              </el-text>
              <el-text class="fileInfo__size" size="small" type="info">
                {{ formatFileSize(raw.size) }}
              </el-text>
            </div>
            <el-progress class="fileInfo__progress" v-else :percentage="progress" striped striped-flow :duration="5"
                         :status="status" :stroke-width="4"/>
          </div>
          <el-button v-if="props.showRemove" class="removeItem" link @click="emit('removeBtnClick', index, xhr)">
            <el-icon size="16">
              <CircleCloseFilled/>
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none !important;
}

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

  .viewIcon__InChat {
    width: 100%;
    max-width: 400px;
  }

  .imageCard {
    height: 50px;
    width: 50px;
    position: relative;

    .viewIcon {
      height: 100%;
      width: 100%;

      box-sizing: border-box;
      border: grey 1px solid;
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-lighter);
    }

    .imageCard__progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .removeItem {
      display: none;
      position: absolute;
      top: -8px;
      right: -8px;
    }
  }

  .imageCard:hover .removeItem {
    display: block;
  }

  .fileBox {
    flex-basis: 150px;
    flex-grow: 1;
    max-width: 245px;
    position: relative;

    .fileCard {
      max-height: 55px;

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
        max-width: 150px;
        width: 100%;

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

        .fileInfo__progress{
          width: 100%;

          :deep(.el-progress__text) {
            min-width: unset;
            font-size: 12px!important;
          }
        }
      }

      .removeItem {
        display: none;
        position: absolute;
        top: -8px;
        right: -8px;
      }
    }
  }

  .fileBox:hover .removeItem {
    display: block;
  }

  @media screen and (max-width: 450px) {
    .fileBox {
      max-width: 400px;

      .fileInfo {
        max-width: 200px;
      }
    }
  }
}
</style>