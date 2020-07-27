import Cookies from 'js-cookie'

const TokenKey = 'Mobile-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token,{expires:100})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
