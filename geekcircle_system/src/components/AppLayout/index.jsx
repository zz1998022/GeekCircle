import Styles from './AppLayout.module.css'
import { Layout } from 'antd';
import AppHeader from "../AppHeader/AppHeader";
import AppSider from "../AppSider/AppSider";
import {useState , useEffect} from "react";
import {useLocation, Outlet} from 'react-router-dom';

const { Header, Sider, Content } = Layout;

function AppLayout(){

    //侧边栏切换
    const [selectedKeys , setSelectedKeys] = useState([]);
    // useLocation react-router自带hook，能获取到当前路由信息
    const location = useLocation();



    // 每次切换路由，获取当前最新的pathname,并赋给menu组件
    useEffect(() => {
        let newPathname = '';
        let pathArr = location.pathname.split('/');
        if(pathArr.length > 3){
            for(let i = 1 ; i <= pathArr.length-2 ; i++){
                newPathname += '/'+pathArr[i];
            }
        }else{
            for(let i = 1 ; i <= pathArr.length-1 ; i++){
                newPathname += '/'+pathArr[i];
            }
        }

        // location.pathname对应路由数据中的path属性
        setSelectedKeys([newPathname]);
    }, [location]);



    return (<>
        <Layout className={Styles.Layout_root__2FMoD}>
            <Header style={{padding: 0}}>
                <AppHeader/>
            </Header>
            <Layout>
                <Sider>
                   <AppSider selectedKeys={selectedKeys}/>
                </Sider>
                <Content style={{padding: 20+'px',overflowY: 'scroll'}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    </>)
}

export default AppLayout;