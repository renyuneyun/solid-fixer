<template>
  <q-list bordered separator class="shadow-4">
    <template v-for="(value, name) in status" :key="name">

      <q-item v-ripple>
        <q-item-section>{{ ProfileStateEnum[name] }} is {{ value }}</q-item-section>
      </q-item>
    </template>
    <q-btn round color="primary" icon="arrow_downward" type="submit" @click="fix">Fix all</q-btn>
  </q-list>
  <q-input class="shadow-4" v-model="webIdDocument" autogrow />
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { ProfileStateEnum, ProfileStatus, PartialProfileStatus, DEFAULT_PROFILE_STATUS, checkProfileStatus, fixProfile } from '../utils/profile-teller';

interface Props {
  webId?: string;
}
const props = defineProps<Props>()

const status = ref<ProfileStatus>({ ...DEFAULT_PROFILE_STATUS })

const webIdDocument = ref('');

watchEffect(async () => {
  if (props.webId) {
    status.value = await checkProfileStatus(props.webId);
  }
})

async function fix() {
  if (props.webId) {
    const goal = {
      [ProfileStateEnum.ContainsStorage]: true
    };

    const { document: document, newStatus: newStatus } = await fixProfile(props.webId, status.value, goal);
    webIdDocument.value = document;
    status.value = { ...status.value, ...newStatus }
  }
}

</script>
