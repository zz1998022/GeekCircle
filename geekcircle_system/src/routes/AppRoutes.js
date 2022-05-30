import { lazy, Suspense } from 'react'
import AppLayout from '../components/AppLayout';

//懒加载实现优化
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Article = lazy(() => import('../pages/Article'));
const Publish = lazy(() => import('../pages/Publish'));
const Error = lazy(() => import('../pages/Error'));

//实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children) =>{
    return <Suspense fallback={<h1>Loading...</h1>}>
        {children}
    </Suspense>
}

export const appRoutes = [
    { path: "/" , element: <AppLayout /> ,
        children: [
            { index: "/home" , element: lazyLoad(<Home />) ,
                children:[
                    {path: "/home/article" , element: lazyLoad(<Article/>)},
                    {path: "/home/publish/:id" , element: lazyLoad(<Publish/>)},
                ]},
        ]},
    { path: "/login",element: lazyLoad(<Login/>)},
    { path: "*" , element: <Error />}
]
