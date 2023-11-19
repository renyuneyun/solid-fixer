<template>
  <q-input class="shadow-4 q-pa-sm" rounded v-model="webId" label="WebID Profile document URI">
    <template v-slot:append>
      <q-btn round color="primary" icon="arrow_forward" type="submit" @click="$emit('newInput', webId)" />
    </template></q-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineEmits(['newInput'])

// const webId = ref('');
const webId = ref('https://renyuneyun.solidcommunity.net/profile/card#me')

</script>
