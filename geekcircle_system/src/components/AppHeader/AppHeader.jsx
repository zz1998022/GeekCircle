import Style from './AppHeader.module.css';
import { Popconfirm, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons'
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout, userInfo} from "../../store/features/userSlice";
import {useEffect} from "react";
import {useLocalStorage} from "../../hook/useLocalStorage";

function AppHeader(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user,setUser] = useLocalStorage('userInfo','');

    const confirm = () => {
        dispatch(logout());
        message.success('退出成功');
        navigate("/login");
    }

    useEffect(() => {
        dispatch(userInfo()).then(() => {
            setUser(JSON.parse(localStorage.getItem('userInfo')));
        })
    },[dispatch])

    return (
        <>
            <div className={Style.logo} />
            <div className={Style.user_info}>
                <span className={Style.user_name}>{user ? user.name : ''}</span>
                <Popconfirm
                    title="是否确认退出"
                    onConfirm={confirm}
                    okText="退出"
                    cancelText="取消"
                >
                    <span className={Style.logout}>
                        <LoginOutlined />
                        退出
                    </span>
                </Popconfirm>
            </div>
        </>
    )
}
export default AppHeader;