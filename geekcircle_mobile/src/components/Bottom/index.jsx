import {useLocation, useNavigate} from "react-router-dom";
import {AppOutline, MessageOutline, PlayOutline, UserOutline} from "antd-mobile-icons";
import {TabBar} from "antd-mobile";

const Bottom = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { pathname } = location

    const setRouteActive = (value) => {
        navigate(value);
    }

    const tabs = [
        {
            key: '/home',
            title: '首页',
            icon: <AppOutline />,
        },
        {
            key: '/qa',
            title: '问答',
            icon: <MessageOutline />,
        },
        {
            key: '/video',
            title: '视频',
            icon: <PlayOutline />,
        },
        {
            key: '/my',
            title: '我的',
            icon: <UserOutline />,
        },
    ]

    return (
        <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
            {tabs.map(item => (
                <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
        </TabBar>
    )
}

export default Bottom;