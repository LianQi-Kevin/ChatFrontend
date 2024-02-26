<script setup lang="ts">
import router from "@/router";
import Config from "@/components/ConfigSpark.vue";


</script>

<template>
  <Config :submitCallable="() => {
    router.push('/')
  }"/>
</template>

<style scoped lang="scss">

</style>