import Cookie from 'js-cookie';
const key = 'accessToken'
// 设置cookie, 过期时间为2个小时
export function setToken(val){
  // let date = new Date();
  // let expires = date.getTime() + 2*60*60*1000;
  // date.setTime(expires);
  // Cookie.set(key, val, {expires: date})
  Cookie.set(key, val)
}

// 读取cookie
export function getToken(){
  return Cookie.get(key)
}

// 删除cookie
export function removeToken(){
  Cookie.remove(key)
}
