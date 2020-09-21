import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/backend/web/login',
    method: 'post',
    params: {
      loginName: data.username,
      password: data.password
    }
  })
}

export function buLogin(data) {
  return request({
    url: '/bc/web/login',
    method: 'post',
    params: {
      loginName: data.username,
      password: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/backend/web/getUser',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/backend/web/logout',
    method: 'post'
  })
}
