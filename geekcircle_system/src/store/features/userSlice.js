import {createSlice, createAsyncThunk, createStore} from '@reduxjs/toolkit';
import service from "../../request/axios";

//createAsyncThunk 方法对返回值是 action creator 函数，调用它并将返回值传递给dispatch，可以触发该异步操作的执行
//登录
export const login = createAsyncThunk("user/login",async (payload) => {
    //异步操作成功，返回异步操作结果 它将作为 fulfilled action 的 payload
    //异步操作失败，抛出异常，它将作为 rejected action 的 error
    try{
        let response = await service.post('/authorizations',payload);
        return response.data;
    } catch (error){
        throw new Error("登录失败 用户名或密码错误");
    }
})

//获取用户信息
export const userInfo = createAsyncThunk("user/userInfo",async () => {
    try{
        let response = await service.get('/user/profile');
        return response.data;
    } catch(error){
        throw new Error("用户信息获取失败");
    }
})


//创建Slice
const { actions , reducer: userReducer } = createSlice({
    //命名空间
    name: 'user',
    //初始值
    initialState: {
        userInfo: {},
        token: '',
        refresh_token: '',
    },
    reducers:{
        //对状态进行处理
        //用户登出
        logout(state,action){
            state.userInfo = {};
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            //存储鉴权状态
            const auth = {auth: false};
            localStorage.setItem('auth',JSON.stringify(auth));
        }
    },
    //通过 extraReducers 配置项处理异步 action
    extraReducers: {
        //login 成功
        [login.fulfilled](state,action) {
            //存储鉴权状态
            const auth = {auth: true};
            localStorage.setItem('auth',JSON.stringify(auth));
            //存到本地缓存
            localStorage.setItem('token',action.payload.token);
            //存到全局变量中
            state.token = action.payload.token;
            state.refresh_token = action.payload.refresh_token;
        },
        //login 失败
        [login.rejected](state,action) {
            state.userInfo.token = '';
            state.userInfo.refresh_token = '';
        },
        //userinfo 成功
        [userInfo.fulfilled](state,action){
            state.userInfo = action.payload;
            localStorage.setItem('userInfo',JSON.stringify(action.payload));
        }
    }
});

//导出 action creator 函数 ， 供组件使用
export const { logout } = actions;

//导出 reducer 函数
export default userReducer;
