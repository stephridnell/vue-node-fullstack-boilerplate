import Api from '@/vuex/api'

import {
  MAKE_REQUEST_FROM_API,
  SET_MODULE_DATA
} from '@/vuex/types'

const api = new Api()

const state = {
  data: {
    message: 'Default Message'
  }
}

const mutations = {
  [SET_MODULE_DATA] (context, payload) {
    context.data = payload
  }
}

const actions = {
  async [MAKE_REQUEST_FROM_API] (context) {
    let data = await api.useApiExample()
    context.commit(SET_MODULE_DATA, data)
  }
}

const getters = {
  moduleData ({ data }) {
    return data
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
