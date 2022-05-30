//在index.js中引入axios
import axios from 'axios';

//区分开发环境还是生产环境基础URL
export const basciUrl = 'http://toutiao.itheima.net/v1_0';

//设置axios基础路径
const service = axios.create({
    baseURL: basciUrl
})

// 请求拦截器
service.interceptors.request.use(config => {
    // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = window.localStorage.getItem('mobile_token') || window.sessionStorage.getItem('token');
    if(token){
        //设置请求头
        config.headers = {
            'Authorization': 'Bearer '+token
        }
    }
    // 下面以使用FormData的file字段名来保存文件举例。
    // 若为单图上传，则将File类型保存到字段名`file`中即可。
    // 若为多图上传，则需将File类型的数据数组保存在`file[]`形式的字段内。
    // if (config.headers['Content-Type'] === 'multipart/form-data') {
    //     const { data } = config
    //     let fd = new FormData()
    //
    //     for (const key in data) {
    //         if (data.hasOwnProperty(key)) {
    //             if (key.endsWith('[]')) {
    //                 data[key].forEach(item => {
    //                     fd.append(key, item)
    //                 })
    //             } else {
    //                 fd.append(key, data[key])
    //             }
    //         }
    //     }
    //
    //     config.data = fd
    // }

    return config
}, error => {
    return error;
})


// 响应拦截器
service.interceptors.response.use(response => {
    //根据返回不同的状态码做不同的事情
    // 这里一定要和后台开发人员协商好统一的错误状态码
    if (response.status) {
        switch (response.status) {
            case 200:
            case 201:
                return response.data.data;
                break;
            case 400:
                return response;
            case 401:
                //未登录处理方法
                break;
            default:
        }
    } else {
        return response;
    }
},error => {
    if(error.response.status === 401){
        localStorage.removeItem('mobile_token');
        localStorage.removeItem('mobile_refresh_token');
    }
    return error.response.data;
})

//最后把封装好的axios导出
export default service;


