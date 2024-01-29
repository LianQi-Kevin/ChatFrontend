<script setup>
import DB from "@/tools/db.js"

const apiCredentials  = reactive({
  APPID: "",
  APISecret: "",
  APIKey: "",
  APIVersion: "v3",
  APIDomain: "generalv3",
  APIUrl: "wss://spark-api.xf-yun.com/v3.1/chat"
});

const ruleFormRef = ref()

const apiCredentialsRoles = {
  APPID: [{ required: true, message: "Please input your APPID", trigger: "blur" },],
  APISecret: [{ required: true, message: "Please input your APISecret", trigger: "blur" },],
  APIKey: [{ required: true, message: "Please input your APIKey", trigger: "blur" },],
  APIVersion: [{ required: true },],
}

const APIOptions = [
  {
    value: 'V1',
    label: 'Version 1',
    APIDomain: import.meta.env.VITE_XINGHUO_DOMAIN_V1,
    APIUrl: import.meta.env.VITE_XINGHUO_SPEAKER_API_V1
  },
  {
    value: 'V2',
    label: 'Version 2',
    APIDomain: import.meta.env.VITE_XINGHUO_DOMAIN_V2,
    APIUrl: import.meta.env.VITE_XINGHUO_SPEAKER_API_V2
  },
  {
    value: 'V3',
    label: 'Version 3',
    APIDomain: import.meta.env.VITE_XINGHUO_DOMAIN_V3,
    APIUrl: import.meta.env.VITE_XINGHUO_SPEAKER_API_V3
  }
]

function saveConfig(formEl) {
  // 更新 apiCredentials
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.debug(apiCredentials)
      DB.setItem("apiCredentials", toRaw(apiCredentials));
    }
  })
}

function updateAPI(value) {
  const api = APIOptions.find(item => item.value === value)
  if (api) {
    apiCredentials.APIDomain = api.APIDomain
    apiCredentials.APIUrl = api.APIUrl
  }
}

onMounted(async () => {
  // 获取 apiCredentials
  const apiCredentials_ = await DB.getItem("apiCredentials");
  if (apiCredentials_) {
    Object.assign(apiCredentials, apiCredentials_);
  }
})

</script>

<template>
  <div class="content">
    <el-card class="card-options">
      <template #header>
        <div class="card-header">
          <span class="title">Configuration</span>
        </div>
      </template>

      <el-form
        ref="ruleFormRef"
        :rules="apiCredentialsRoles"
        :model="apiCredentials"
        label-width="100px"
        label-position="left"
        status-icon
      >
        <el-form-item label="APPID" prop="APPID">
          <el-input v-model="apiCredentials.APPID" placeholder="Enter your App ID" clearable />
        </el-form-item>
        <el-form-item label="APISecret" prop="APISecret">
          <el-input v-model="apiCredentials.APISecret" placeholder="Enter your API Secret" clearable />
        </el-form-item>
        <el-form-item label="APIKey" prop="APIKey">
          <el-input v-model="apiCredentials.APIKey" placeholder="Enter your App Key" clearable />
        </el-form-item>
        <el-form-item label="API Version" prop="APIVersion">
          <el-select v-model="apiCredentials.APIVersion" placeholder="Select" @change="updateAPI" >
            <el-option v-for="item in APIOptions" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="APIDomain" prop="APIDomain">
          <el-input v-model="apiCredentials.APIDomain" placeholder="Enter your App Key" clearable disabled />
        </el-form-item>
        <el-form-item label="APIUrl" prop="APIUrl">
          <el-input v-model="apiCredentials.APIUrl" placeholder="Enter your App Key" clearable disabled />
        </el-form-item>
      </el-form>

      <div class="card-footer">
        <el-button type="primary" @click="saveConfig(ruleFormRef)" size="large" class="submit">
          Save and Submit
        </el-button>
      </div>
      <el-link href="https://xinghuo.xfyun.cn/sparkapi?scr=price" target="_blank" type="info">
        Click here to application the XingHuo APIKeys
      </el-link>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.content{
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  max-width: 500px;
  max-height: 450px;
}

.card-options {
  .card-header {
    .title{
      font-size: 25px;
      font-weight: bold;
    }
  }

  .card-footer {
    display: flex;
    justify-content: center;

    .submit {
      width: 100%;
    }
  }
}

</style>