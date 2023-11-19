<template>
  <session-provider>
    <router-view />
  </session-provider>
</template>

<script setup lang="ts">
import { SessionProvider } from 'solid-helper-vue'

import * as process from 'process';  // For Comunica. May not be the best solution. Suggestions welcome.

window.process = process;
</script>
