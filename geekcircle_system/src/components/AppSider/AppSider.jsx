import { Menu } from 'antd';
import {RoutesShowList} from "../../routes/RoutesShowList";
import {Link} from "react-router-dom";

function AppSider(props){
    return (
        <Menu
            selectedKeys={props.selectedKeys}
            mode="inline"
            theme="dark"
            style={{
                width: 200,
            }}
        >
            {
                RoutesShowList.map((route) => (
                    <Menu.Item key={route.path}>
                        <Link to={route.path}>{route.icon} {route.name}</Link>
                    </Menu.Item>
                ))
            }
        </Menu>
    )
}

export default AppSider;