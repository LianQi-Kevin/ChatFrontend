<script setup>
import {useRoute, useRouter} from "vue-router";
const route = useRoute()
const router = useRouter()
</script>

<template>
    <div class="container">
        <h1>{{route.params.id}} ERROR</h1>
        <p>This page have some problems</p>
        <el-button-group>
            <el-button @click="() => {router.back()}" size="large">Go Back</el-button>
            <el-button @click="() => {router.push('/home')}" size="large">Go Home</el-button>
        </el-button-group>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>