import axios from 'axios'

let instance = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// axios request interceptorts
instance.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error.response)
})

// axios response interceptors
instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response && error.response.status === 401) {
    return Promise.reject(error.response)
  }
})

class Api {
  async useApiExample () {
    let { data } = await instance.get('public/getSample')
    return data
  }
}

export default Api
