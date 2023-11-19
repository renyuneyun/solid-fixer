<template>
  <template v-if="sessionInfo?.isLoggedIn">
    <q-btn dense flat round @click="iLogout">
      <!-- <img :src="userInfo.avatar" /> -->
      Logout
    </q-btn>
  </template>
  <template v-else>
    <q-select filled use-input fill-input hide-selected v-model="chosenIdp" :options="IDPs" hint="Identity Provider"
      @input-value="onIdpInput" /><q-btn @click="iLogin">Log in</q-btn>
  </template>
</template>

<script setup lang="ts">
import { KEYS } from 'solid-helper-vue';
import { UserInfoStruct, getUserInfo } from '@renyuneyun/solid-helper';
import { inject, ref, watchEffect } from 'vue';

defineEmits(['newInput'])

const IDPs = [
  'https://solidcommunity.net/',
  'https://solidweb.org/'
]

const session = inject(KEYS.SESSION);
const sessionInfo = inject(KEYS.SESSION_INFO)
const login = inject(KEYS.LOGIN);
const logout = inject(KEYS.LOGOUT);

const chosenIdp = ref('')

// const redirectUrl = new URL(import.meta.env.BASE_URL, window.location.href).href
// const redirectUrl = window.location.origin
const redirectUrl = new URL(import.meta.env.BASE_URL + 'callback/', window.location.href).href
// const redirectUrl = window.location.href + 'callback/'
// const redirectUrl = 'callback'

// const userInfo = ref({} as UserInfoStruct)

function onIdpInput(value: string) {
  chosenIdp.value = value
}

function iLogin() {
  console.log('login with:', chosenIdp.value, redirectUrl)
  // sessionStore.login(chosenIdp.value, redirectUrl, 'Solid Fixer')
  login(chosenIdp.value, redirectUrl, 'Solid Fixer')
}

function iLogout() {
  logout()
  // userInfo.value = {}
}

watchEffect(async () => {
  if (sessionInfo?.webId) {
    // const userInfoNew = await getUserInfo(sessionInfo.webId)
    // userInfo.value = userInfoNew
  }
})

// setInterval(async () => {
//   // console.log('sessionStore {webid,isLoggedIn} session.info.{webid,isLoggedIn}', session.webId, session.isLoggedIn, session.session.info.isLoggedIn, session.session.info.webId)
//   // console.log('session.info.{webid,isLoggedIn}', session.info.isLoggedIn, session.info.webId)
//   console.log('sessionInfo.{webid,isLoggedIn}', sessionInfo.isLoggedIn, sessionInfo.webId)
// }, 1000)

</script>
