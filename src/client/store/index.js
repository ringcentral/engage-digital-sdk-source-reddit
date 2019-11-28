import SubX from 'subx'
import fetch from './fetch'

const store = SubX.create({
  logined: false,
  user: {},
  botInfo: window.rc.botInfo,
  // loading: false,
  switching: false,
  fetchingUser: false,
  submitting: false,
  // async updateSigned (signed) {
  //   store.loading = true
  //   let res = await fetch.post(window.rc.server + '/api/action', {
  //     action: 'bot-signature-switch',
  //     update: {
  //       signed
  //     }
  //   })
  //   store.loading = false
  //   if (res) {
  //     store.user.signed = signed
  //   }
  // },
  async update (update, prop = 'submitting') {
    store[prop] = true
    let res = await fetch.post(window.rc.server + '/api/action', {
      action: 'update',
      update
    })
    store[prop] = false
    if (res) {
      Object.assign(store.user, update)
    }
  },
  updateEnabled (enabled) {
    return store.update({
      enabled
    }, 'switching')
  },
  async getUser () {
    store.fetchingUser = true
    let res = await fetch.post(window.rc.server + '/api/action', {
      action: 'get-user'
    }, {
      handleErr: () => {
        console.log('fetch user error')
      }
    })
    store.fetchingUser = false
    if (res) {
      store.user = res.result
      store.logined = !!res.result.id
    }
  }
})

export default store
