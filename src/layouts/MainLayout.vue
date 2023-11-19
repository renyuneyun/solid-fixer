<template>
  <q-layout view="hHr lpR fFr">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Solid Fixer
        </q-toolbar-title>

        <template v-if="userInfo.avatar">
          <q-btn dense flat round @click="toggleRightDrawer">
            <q-avatar size="42px">
              <img :src="userInfo.avatar">
            </q-avatar>
          </q-btn>
        </template>
        <template v-else>
          <q-btn dense flat round icon="no_accounts" @click="toggleRightDrawer" />
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <user-info />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { useSessionStore } from 'solid-helper-vue';
import { KEYS } from 'solid-helper-vue';
import { inject, ref, watchEffect } from 'vue'
import UserInfo from 'src/components/UserInfo.vue'
import { UserInfoStruct, getUserInfo } from '@renyuneyun/solid-helper';

const sessionStore = useSessionStore()

const rightDrawerOpen = ref(sessionStore.isLoggedIn)

const sessionInfo = inject(KEYS.SESSION_INFO)
const userInfo = ref({} as UserInfoStruct)

watchEffect(async () => {
  if (sessionInfo?.value?.webId) {
    console.log('sessionInfo has webid')
    const userInfoNew = await getUserInfo(sessionInfo?.value?.webId)
    userInfo.value = userInfoNew
    console.log('new userInfo:', userInfo.value)
  } else {
    userInfo.value = {}
  }
})

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
