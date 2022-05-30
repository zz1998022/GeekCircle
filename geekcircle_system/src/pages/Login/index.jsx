import './Login.css';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { Card , Form , Input , Checkbox , Button , message} from 'antd';
import { useDispatch } from 'react-redux';
import {login} from '../../store/features/userSlice';

function Login(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //提交表单且数据验证成功后回调事件
    const onFinish = (formData) => {
        if(formData.remember){
            //将发起异步请求
            dispatch(login({
                mobile: formData.mobile,
                code: formData.code
            })).then((response) => {
                if(response.meta.requestStatus === 'fulfilled'){
                    message.success("登录成功");
                    navigate('/home');
                }
            })
        }else{
            message.error("请勾选协议")
        }
    }

    //表单默认值
    const [initialValues , setInitialValues] = useState({
        mobile: '13911111111',
        code: '246810',
        remember: true
    });

    return (
        <div className={'login'}>
            <Card className={'login_wrapper'}>
                <div className={'logo'} />
                <Form
                    name="basic"
                    initialValues={initialValues}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="mobile"
                        rules={[{ required: true, message: '手机号不能为空' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: '验证码不能为空' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login;