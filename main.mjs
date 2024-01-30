// noinspection JSUnusedLocalSymbols

import { BASE_URL, ENDPOINTS } from './constants.mjs'
import { Webdevep } from './index.mjs'

const app = new Webdevep(BASE_URL, ENDPOINTS)

const email = 'user1@mail.ru'
const password = 'password'

app.once('ready', async () => {
  // console.log(await app.getPublicKey())
  // console.log(await app.confirmCode(email))
  // console.log(await app.registerUser(email, password))
  // console.log(await app.login(email, password))
  // console.log(await app.logout())
  console.log(await app.getUserInfo())

})
