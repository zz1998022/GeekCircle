import {
    Form,
    Input,
    Button,
    NavBar,
    Toast
} from 'antd-mobile'
import './Login.css';
import service from "../../request/axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

let timer = null;

function Login(){
    const navigate = useNavigate();
    //手机号
    const [mobile,setMobile] = useState();
    const [time,setTime] = useState(0);

    //获取当前手机号信息
    const changeMobile = (value) => {
        setMobile(value);
    }

    useEffect(() => {
        timer && clearInterval(timer);
        return () => timer && clearInterval(timer);
    },[]);

    useEffect(() => {
        if( time === 60 ) timer = setInterval(() => setTime(time => --time),1000)
        else if (time === 0) clearInterval(timer)
    },[time])

    //短信验证码
    const sendCode = () => {
        service.get(`/sms/codes/${mobile}`).then((result) => {
            setTime(60);
        });
    }

    //登录
    const onFinish = (values)=> {
        service.post('/authorizations',values).then((result) => {
            localStorage.setItem('mobile_token',result.token);
            localStorage.setItem('mobile_refresh_token',result.refresh_token);
            Toast.show({
                icon: 'success',
                content: '登录成功',
            })
            navigate('/my');
        })
    }

    return (
        <>
            <div className="top" onClick={() => navigate('/home')}>
                <NavBar />
            </div>
            <div className="wrapper">
                <h3 className="title">短信登录</h3>
                <Form
                    name='form'
                    onFinish={onFinish}
                    style={{
                        '--border-top':'0',
                        '--border-bottom': '0'
                    }}
                    footer={
                            <Button block type='submit' color='primary' size='large'>
                                登录
                            </Button>
                    }
                >
                    <Form.Item name='mobile' label='' rules={[{ required: true , message: '请输入手机号'}]}>
                        <Input placeholder='请输入手机号' onChange={(e) => changeMobile(e)}/>
                    </Form.Item>
                    <Form.Item name='code' label='' extra={
                        <button className="code" onClick={sendCode} disabled={time}>{time ? `${time}秒后再次发送` : '发送验证码'}</button>

                    } rules={[{ required: true , message: '请输入验证码'}]}>
                        <Input placeholder='请输入验证码' />
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default Login;