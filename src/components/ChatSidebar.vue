<script setup>

const props = defineProps({
  userid: {
    required: true,
    type: String
  },
  modelName: {
    required: true,
    type: String
  }
})

</script>

<template>
  <div class="sidebarContent">
    <div class="sidebarHeader">
      <el-text class="modelName">{{ modelName }}</el-text>
    </div>
    <div class="sidebarHistory">
<!--      test-->
    </div>
    <div class="sidebarUser">
      <el-avatar>{{props.userid}}</el-avatar>
      <el-text>{{props.userid}}</el-text>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebarContent {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .sidebarHeader {
    margin: 15px;

    .modelName{
      text-align: left;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .sidebarHistory {
    display: flex;
    flex-direction: column;
    justify-content: start;

    flex-grow: 1;
  }

  .sidebarUser {
    flex-grow: 0;
  }
}
</style>