<script setup lang="ts">

const props = defineProps<{
  submitCallable?: Function
}>()

const apiCredentials = reactive({
  API_URL: "",
});

function saveConfig() {
}
</script>

<template>
  <div class="configContent" style="z-index: 99">
    <div class="configMask" />
    <el-card class="card-options">
      <template #header>
        <el-text class="card-header" size="large" tag="b">Configuration</el-text>
      </template>

      <div class="card-footer">
        <el-button type="primary" @click="saveConfig()" size="large" class="submit-btn" plain >
          Save and Submit
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.configContent{
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 450px;
}

.configMask {
  width: 100vw;
  height: 100vh;
  z-index: -1;
  position: absolute;
  background: var(--el-mask-color);
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.card-options {
  .card-header {
      //font-size: 25px;
      font-weight: bold;
  }

  .card-footer {
    display: flex;
    justify-content: center;

    .submit-btn {
      width: 100%;
    }
  }
}

</style>