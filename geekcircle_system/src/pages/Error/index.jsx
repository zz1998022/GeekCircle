import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Error(){
    const navigate = useNavigate();
    const [time , setTime] = useState(5);
    //创建定时器
    const timer = setTimeout(() => {
        setTime(time-1);
        if(time <= 0){
            setTime(5)
            navigate("/home")
            clearTimeout(timer);
        }
    },1000)

    return (
        <>
            <h1>对不起，您访问的页面不存在</h1>
            <span>将在{time}秒后，返回首页（或者：点击立即返回 <a href="/home">首页</a>）</span>
        </>
    )
}

export default Error;