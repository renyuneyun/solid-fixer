<template>
  <div>Log-in callback</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { useSessionStore } from 'solid-helper-vue';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();

const router = useRouter()

onBeforeMount(async () => {
  console.log('Callback onBeforeMount')
  const info = await sessionStore.handleRedirectAfterLogin()
  console.log('user info:', info)
})

onMounted(() => {
  router.push('/')
})
</script>
