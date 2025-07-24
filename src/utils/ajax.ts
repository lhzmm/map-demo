/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import type {
  IPromiseAxiosConfig, IPromiseAxiosErrorValue, AllowedRequestMethod,
  IPromiseAxiosThenValue,
} from '@dc/common-tool/dist/@types/ajax/abstract'
import { ElMessage } from 'element-plus'
import { Ajax, PENDING } from '@dc/common-tool'
import { baseURL } from '@/config/api'
import { TOKEN_KEY } from '@/config/constant'
import type { AxiosResponse } from 'axios'

const defaultOptions = {
  baseURL,
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  timeout: 60000, // 默认60s请求超时
  //   validateStatus: function (status) {
  //     return status >= 200 && status < 300; // default
  //   },
}

// 当token过期时,当前是否已发送login请求
let reLogin = false

const instance = new Ajax(defaultOptions)

interface IBlob {
  data: Blob & {headers:AxiosResponse['headers']};
  config: IPromiseAxiosConfig;
  response: AxiosResponse<Blob>;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line import/prefer-default-export
export function createAjax<T>(url:string, method?:AllowedRequestMethod) {
  // eslint-disable-next-line arrow-body-style
  return (data:any, extraConfig?:IPromiseAxiosConfig) => {
    const token = sessionStorage.getItem(TOKEN_KEY)

    if (token) {
      extraConfig = extraConfig || {}
      extraConfig.headers = extraConfig.headers || {}
      extraConfig.headers.token = extraConfig.headers.OJToken || token
    }
    return instance.createAjax<T>(url, method)(data, extraConfig)
      .catch((e:IPromiseAxiosErrorValue|IPromiseAxiosThenValue<string>|IBlob) => {
        if ('error' in e) {
          if (e.error.response) {
            const { status } = e.error.response
            if (status === 401) {
              if (reLogin) return PENDING
              reLogin = true
              ElMessage.error(e.error.response.data.errmsg || 'token过期')
              instance.pendingSourceMap.forEach((sources) => { sources.forEach((sourceItem) => sourceItem.source.cancel()) })
              setTimeout(() => { reLogin = false }, 0)
              return PENDING
            }

            if (status < 200 || status >= 300) {
              if (!e.config.customErrorHandler) {
              // ElMessage.error(`${e.config.baseURL}${e.config.url}:${e.error.response.data.errmsg || e.error.response.data.message}`)
                ElMessage.error(e.error.response.data.errmsg || e.error.response.data.message)
              }
              return Promise.reject(e)
            }
          }
          if (!e.config.customErrorHandler) {
            ElMessage.error(e.error.message)
          }
          return Promise.reject(e)
        }

        if (e.data instanceof Blob) {
          e.data.headers = e.response.headers
          return Promise.resolve(e.data)
        }

        if (!e.config.customErrorHandler) {
        // ElMessage.error(`${e.config.baseURL}${e.config.url}:${e.data.errmsg || e.data.message}`)
          ElMessage.error(e.data.errmsg || e.data.message)
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ config: e.config, error: { response: { data: e.data } } })
      })
  }
}
