import {Divider, NavBar} from "antd-mobile";
import {useLocation,useNavigate} from "react-router-dom";
import Style from './Top.module.css';

function Top(props){
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            {/*标题*/}
            <div className={`${location.pathname === '/chat' ? Style.chat_top:''} top`}>
                <NavBar onBack={() => navigate(-1)}>{props.title}</NavBar>
                <Divider />
            </div>
        </>

    )
}

export default Top;