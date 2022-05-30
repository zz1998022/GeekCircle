import { Navigate , Outlet } from 'react-router-dom';

function AuthGuardOutlet(){
    //获取鉴权结果
    const localAuth = JSON.parse(localStorage.getItem("auth"));
    const result = localAuth ? localAuth.auth : false;

    //判断鉴权结果
    return result ? <Outlet /> : (<Navigate to={"/login"}/>)
}

export default AuthGuardOutlet;