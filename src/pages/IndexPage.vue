<template>
  <q-page padding>
    <profile-input @new-input="onNewInput"></profile-input>
    <profile-status :web-id="webId"></profile-status>
  </q-page>
</template>

<script setup lang="ts">
import ProfileInput from 'src/components/ProfileInput.vue';
import ProfileStatus from 'src/components/ProfileStatus.vue';
import { ref } from 'vue';

const webId = ref('')

console.log('href:', window.location.href)
console.log('process.env.VUE_ROUTER_BASE', process.env.VUE_ROUTER_BASE)
console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL)

function onNewInput(value: string) {
  webId.value = value
}
</script>
