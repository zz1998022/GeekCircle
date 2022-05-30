import {EditSOutline} from "antd-mobile-icons";
import './Chat.css';
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import Top from "../../../components/Top";

function Chat(){
    //本地token获取
    const token = localStorage.getItem('mobile_token');
    //聊天列表
    const [chatList,setChatList] = useState([]);
    //表单内容
    const [input,setInput] = useState("");

    //创建socket ref对象
    const socketRef = useRef();
    //聊天列表 ref对象
    const chatListRef = useRef(null);

    useEffect(() => {
        const socket = io('http://toutiao.itheima.net', {
            query: {
                token: token
            },
            transports: ['websocket']
        })

        socket.on('connect',() => {
            setChatList([
                {
                    type: 'xz',
                    message: "你好，我是小智"
                },
                {
                    type: 'xz',
                    message: '您想知道点啥？'
                }
            ])
        })

        //接收 socket 服务器返回的信息
        socket.on('message',data => {
            setChatList(chatList => [
                ...chatList,
                {
                    type: 'xz',
                    message: data.msg
                }
            ])
        })

        socketRef.current = socket;

        return () => {
            //组件卸载关闭socket连接
            socket.close();
        }
    },[token])

    //监听聊天列表 有新内容滚动到底部
    useEffect(() => {
        const chatListDOM = chatListRef.current;
        if(!chatListDOM) return;

        chatListDOM.scrollTop = chatListDOM.scrollHeight;
    },[chatList]);

    //用户发表
    const handleSubmit = () => {
        setChatList(([
            ...chatList,
            {
                type: 'user',
                message: input
            }
        ]))
        //将消息发送给socket
        socketRef.current?.emit('message',{
            msg: input,
            timestamp: Date.now() + ''
        })

        //清空文本框
        setInput('');
    }
    

    return (
        <>
            {/*标题*/}
            <Top title="小智同学"/>
            {/*聊天内容*/}
            <div className="chat" ref={chatListRef}>
                {chatList.map((item,index) => (
                    <div key={index} className={`${item.type === 'xz' ? 'left' : 'right'} chat_item`}>
                        {item.type === 'xz' ? (
                            <>
                                {/*头像*/}
                                <div className="tt_icon">
                                    <svg t="1652273123411" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="5250" width="40" height="40">
                                        <path
                                            d="M418.238197 331.702986m-331.702986 0a331.702986 331.702986 0 1 0 663.405972 0 331.702986 331.702986 0 1 0-663.405972 0Z"
                                            fill="#8CF6FB" p-id="5251"></path>
                                        <path
                                            d="M690.811521 977.802716l-30.285925-64.898411s157.198372-119.701512 187.484296-212.001473c-12.979682 2.884374-27.401551 5.768748-40.381233 5.768747-72.109345 0-129.796821-57.687476-129.79682-129.796821v-28.843737c0-72.109345 57.687476-129.796821 129.79682-129.796821 20.190617 0 40.381233 4.326561 57.687476 14.421869v-5.768748C865.316135 230.749903 706.675577 72.109345 511.980346 72.109345S158.644556 230.749903 158.644556 425.445134v5.768748c63.456223-31.728112 141.334316-5.768748 173.062428 57.687476 8.653121 18.74843 14.421869 37.496859 14.421869 57.687476v28.843738c0 72.109345-57.687476 129.796821-129.796821 129.79682-60.57185 0-112.490578-41.82342-126.912447-99.510896-1.442187-4.326561-2.884374-8.653121-2.884374-14.421869V425.445134C86.535211 190.36867 276.903882 0 511.980346 0S937.42548 190.36867 937.42548 425.445134V591.296627c0 271.131136-246.613959 386.506088-246.613959 386.506089zM158.644556 576.874758c0 31.728112 25.959364 57.687476 57.687476 57.687476s57.687476-25.959364 57.687476-57.687476v-28.843737c0-31.728112-25.959364-57.687476-57.687476-57.687476s-57.687476 25.959364-57.687476 57.687476v28.843737z m706.671579-28.843737c0-31.728112-25.959364-57.687476-57.687476-57.687476s-57.687476 25.959364-57.687476 57.687476v28.843737c0 31.728112 25.959364 57.687476 57.687476 57.687476s57.687476-25.959364 57.687476-57.687476v-28.843737z"
                                            fill="#3C2DCB" p-id="5252"></path>
                                        <path
                                            d="M719.655259 951.843351c1.442187 37.496859-27.401551 70.667158-66.340598 72.109345H648.988101c-40.381233 1.442187-72.109345-30.285925-73.551532-70.667158s30.285925-72.109345 70.667158-73.551531c40.381233-1.442187 72.109345 30.285925 73.551532 72.109344 0-1.442187 0 0 0 0z"
                                            fill="#D098FF" p-id="5253"></path>
                                    </svg>
                                </div>
                                {/*对话*/}
                                <div className="chat_pao">
                                    {item.message}
                                </div>
                            </>
                        ) : (
                            <>
                                {/*对话*/}
                                <div className="chat_pao">
                                    {item.message}
                                </div>
                                {/*头像*/}
                                <div className="chat_user_image">
                                    <img src="http://geek.itheima.net/images/user_head.jpg" alt=""/>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {/*发送内容*/}
            <div className="reply_container">
                <div className="van_field van_cell">
                    <div className="van_field_left_icon">
                        <i className="van_icon"><EditSOutline /></i>
                    </div>
                    <div className="van_cell_value">
                        <div className="van_field_body">
                            <input type="text"
                                   placeholder="请描述您的问题"
                                   className="van_field_control"
                                   value={input}
                                   onChange={(e) => setInput(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <span onClick={handleSubmit}>发送</span>
            </div>
        </>
    )
}
export default Chat;