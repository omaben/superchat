import request from '@/utils/request'


export function register(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}


export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
