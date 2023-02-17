/* eslint-disable */
// 星火点击上报 加密
import axios from 'axios'
import CryptoJS from 'crypto-js'
import md5 from 'js-md5'
import qs from 'qs'

const _KEV = 'iHATLhQo0zln1508'
const _IV = 'iHATLhQo0zln1508'

function encrypt (data = {}) {
  const key = CryptoJS.enc.Utf8.parse(_KEV)
  const iv = CryptoJS.enc.Utf8.parse(_IV)
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    })
  return encrypted.toString() // 返回的是base64格式的密文
}

function decrypt (encrypted) {
  const key = CryptoJS.enc.Utf8.parse(_KEV)
  const iv = CryptoJS.enc.Utf8.parse(_IV)
  const decrypted = CryptoJS.AES.decrypt(encrypted, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

function md5ForFy (content, time) {
  const SALT = '3afn4UpdQzENHhZji1jC'// 加盐 此常量后端提供
  const s = content + SALT + time
  return md5(s)
}

export const httpXHReport = axios.create({
  timeout: 1000 * 20,
  withCredentials: true,
  headers: { // 头部信息
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

httpXHReport.interceptors.request.use(config => {
  const timestamp = new Date().getTime()
  const content = encrypt(config.data)// aes加密
  const sign = md5ForFy(content, timestamp) // 获取签名sign参数
  const config_ = { // 需要的参数content、sign、timestamp
    content: '', // AES加密后的字符串
    sign: '', // 签名sign  app.md5ForFy获取
    timestamp: '' // 当前时间戳
  }
  // 组合参数
  config_.timestamp = timestamp
  config_.content = content
  config_.sign = sign

  config.data = config_
  console.log(config)
  config.data = qs.stringify(config.data)
  return config
})
