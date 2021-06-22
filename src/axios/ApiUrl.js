import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 預設url
axios.defaults.baseURL = 'http://localhost:9099/api/'

axios.interceptors.request.use(async config => {
  NProgress.start()

  const currentUrl = window.location.href

  if (await currentUrl !== 'http://localhost:8080/#/login') {
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  return config
})
// 再response 中隱藏進度條
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export const loginUrl = 'login'

export const menuListUrl = 'menu/list'
export const categoryTreeListUrl = 'category/tree/list'
export const categoryListUrl = 'category/list'
export const categoryUpdateUrl = 'category/update'
export const categoryRemoveUrl = 'category/delete/'

export const goodsListUrl = 'goods/list'
export const goodsAddUrl = 'goods/add'
export const goodsUpdateUrl = 'goods/update/'
export const userAddsUrl = 'users/add'
export const usersListUrl = 'users/list'
export const usersUpdateUrl = 'users/update/'
export const usersStatusUrl = 'users/status/'
export const getUsersUrl = 'users/'

export const getUserApi = params => axios.get(getUsersUrl + params)
  .catch(error => {
    Message.error(error.response.message)
  })
export const getUserListApi = data => axios.get(usersListUrl, { params: data })
  .catch(error => {
    Message.error(error.response.message)
  })
export const usersAddApi = data => axios.post(userAddsUrl, data)

  .catch(error => {
    Message.error(error.response.message)
  })
export const getgoodsListApi = data => axios.get(goodsListUrl, { params: data })
  .catch(error => {
    Message.error(error.response.message)
  })
export const goodsAddApi = data => axios.post(goodsAddUrl, data)
  .catch(error => {
    Message.error(error.response.message)
  })

export const categoryUpdateApi = data => axios.post(categoryUpdateUrl, data)
  .catch(error => {
    Message.error(error.response.message)
  })
export const getCategoryListApi = data => axios.get(categoryListUrl, { params: data })
  .catch(error => {
    Message.error(error.response.message)
  })
export const removeCategoryApi = categoryId => axios.delete(categoryRemoveUrl + categoryId)
  .catch(error => {
    Message.error(error.response.message)
  })
export const loginApi = data => axios.post(loginUrl, data).catch(error => {
  Message.error(error.response.message)
})

/**
 *
 * @param id
 * @param url
 * @param data
 * @return {Promise<AxiosResponse<any>>}
 */
export async function modifyApi (url, id, data) {
  return await axios.put(url + id, data)
    .catch(error => {
      Message.error(error.message)
    })
}

/**
 *
 * @param url
 * @return {ElMessageComponent}
 */
export async function handleGetAxios (url) {
  const { data: res } = await axios.get(url).catch(error => {
    Message.error(error.message)
  })
  if (res.status === 200) {
    return res.data
  } else {
    Message.error(res.message)
  }
}

/**
 *
 * @param url
 * @param data
 * @return {ElMessageComponent}
 */
export async function getPageList (url, data) {
  const { data: res } = await axios.get(url, { params: data })
  if (res.status === 200) {
    return res.data
  } else {
    Message.error(res.message)
  }
}
