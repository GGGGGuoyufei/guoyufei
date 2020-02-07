import axios from 'axios';
import qs from "qs";
// import { getStore, setStore } from './storage';
import { router } from '@/router';
// import { Message } from 'iview';
import { getToken, removeToken } from './cookie'
// import Cookies from 'js-cookie';
// 统一请求路径前缀
let base = '/cmp';
// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    // console.log(config)
    return config;
}, err => {
    // Message.error('请求超时');
    return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
    const data = response.data
        // if(data.code === "401"){
        //     removeToken()
        //     window.reload()
        // }
        // 根据返回的code值来做不同的处理(和后端约定)
        // switch (data.code) {
        //     case "401":
        //         // console.log(1)
        //         // 未登录 清除已登录状态
        //         Cookies.set('userInfo', '');
        //         setStore('accessToken', '');
        //         if (router.history.current.name != "login") {
        //             if (data.mesg !== null) {
        //                 Message.error(data.mesg);
        //             } else {
        //                 Message.error("未知错误，请重新登录");
        //             }
        //             router.push('/login');
        //         }
        //         break;
        //     case 403:
        //         // 没有权限
        //         if (data.mesg !== null) {
        //             Message.error(data.mesg);
        //         } else {
        //             Message.error("未知错误");
        //         }
        //         break;
        //     case 500:
        //         // 错误
        //         console.log(3)
        //         if (data.mesg !== null) {
        //             Message.error(data.mesg);
        //         } else {
        //             Message.error("未知错误");
        //         }
        //         break;
        //     default:
        //         return data;
        // }
    return data;
 }, (err) => {
    let errData = err.response.data;
    // console.log(err.response);
    // console.log(errData.code)
    if(errData.code == "401"){
        removeToken()
        // window.reload()
        // Message.error("登录失效");
        this.$router.push("/login")
    }
    //返回状态码不为200时候的错误处理
    // Message.error(err.toString());
    return Promise.resolve(err);
});
//登录的Request(get)
export const getRequestLogin = (url, params) => {
    let accessToken = getToken();
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
};
//获取数据的Request(get)
export const getRequest = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp";
    var time = new Date().getTime();
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
};

//获取数据的Request(post)
export const postRequest = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp"
    var time = new Date().getTime();
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`,

        }
    });
};
//获取数据的Request(post) + Form
export const postRequestForm = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp"
    return axios({
        method: 'post',
        url: `${base}${url}`,
        params: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    });
};
//获取数据的Request(post) + application
export const postRequestJson = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp"
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
};
//删除数据的Request(delete)
export const deleteRequest = (url, params) => {
    var base = "/cmp"
    let accessToken = getToken();
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
};
//删除数据的Request(delete) + application
export const deleteRequestJson = (url, params) => {
    var base = "/cmp"
    let accessToken = getToken();
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
};
//修改数据的Request(put)
export const putRequest = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp"
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
};
//修改数据的Request(put) + application
export const putRequestJson = (url, params) => {
    let accessToken = getToken();
    var base = "/cmp"
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
};
//上传文件的Request(post) + FormData
export const postRequestFormFile = (url,params,query) => {
    let accessToken = getToken();
    var base = "/cmp"
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        params:query,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    });
};