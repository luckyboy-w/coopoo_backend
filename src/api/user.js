import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login-in',
    method: 'post',
    params: {
      account: data.username,
      password: data.password
    }
  })
}


// export function getInfo(token) {
//   return request({
//     url: '/backend/web/getUser',
//     method: 'get'
//   })
// }

export function logout() {
  return request({
    url: '/login/login-out',
    method: 'post'
  })
}
