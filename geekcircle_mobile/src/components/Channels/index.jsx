import {NavBar, Toast} from "antd-mobile";
import {CloseOutline} from 'antd-mobile-icons';
import {useState} from "react";
import Style from './Channels.module.css';
import {useNavigate} from "react-router-dom";
import service from "../../request/axios";

function Channels(props){
    const navigate = useNavigate();
    //是否编辑
    const [isEdit,setIsEdit] = useState(false);
    //token
    const token = localStorage.getItem('mobile_token');
    //顶部右侧
    const right = (
        <div style={{ fontSize: 24 , marginRight: 1+'rem'}} onClick={() => props.setChannelVisible(false)}>
            <CloseOutline />
        </div>
    )

    //添加频道
    const addChannel = (channel) => {
        //判断token
        if(token === null){
            navigate('/login');
        }
        //发起请求
        service({
            url: '/user/channels',
            type: 'PATCH',
            data: {
                channels: [channel]
            }
        }).then((result) => {
            props.setChannelList([...props.channelList,channel]);
            props.setChooseChannelList(props.chooseChannelList.filter(item => item.id !== channel.id));
            Toast.show({
                icon: 'success',
                content: '添加成功',
            })
        })
    }

    //删除频道
    const delChannel = (channel) => {
        //判断token
        if(token === null){
            navigate('/login');
        }
        //发起请求
        service({
            type: 'DELETE',
            url: '/user/channels',
            params: {
                target: channel.id
            }
        }).then(() => {
            props.setChannelList(props.channelList.filter(item => item.id !== channel.id));
            props.setChooseChannelList([...props.chooseChannelList,channel]);
            Toast.show({
                icon: 'success',
                content: '删除成功',
            })
        })
    }

    return (
        <>
            {/*顶部*/}
            <div>
                <NavBar right={right} backArrow={false} />
            </div>
            {/*我的频道*/}
            <div className={Style.channel}>
                <div className={Style.my_channel_tit}>
                    我的频道:
                    <span>点击进入频道</span>
                    <button onClick={() => setIsEdit(!isEdit)}>
                        <span>{isEdit ? '完成' : '编辑'}</span>
                    </button>
                </div>
                <div className={Style.my_channel_list}>
                    {
                        props.channelList?.map(item => (
                            <div key={item.id} className={Style.my_channel_item}>
                                <span className={`${item.id === props.checkChId ? Style.active : ''}`} onClick={() => {
                                    props.setChannelVisible(false);
                                    props.getArticles(item.id,Date.now() + '')
                                }}>{item.name}</span>
                                <div className={`${Style.tt_icon} ${isEdit ? '' : Style.is_edit}`} onClick={() => delChannel(item)}>
                                    <svg t="1652748992121" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="2651" width="15" height="15">
                                        <path
                                            d="M512 0C229.216 0 0 229.216 0 512s229.216 512 512 512 512-229.216 512-512S794.784 0 512 0zM709.184 663.936c16.064 16.064 18.976 39.232 6.464 51.712s-35.648 9.6-51.712-6.464L512 557.248l-151.936 151.936c-16.064 16.064-39.232 18.976-51.712 6.464s-9.6-35.648 6.464-51.712L466.752 512l-151.936-151.936c-16.064-16.064-18.976-39.232-6.464-51.712 12.512-12.512 35.648-9.6 51.712 6.464L512 466.752l151.936-151.936c16.064-16.064 39.232-18.976 51.712-6.464 12.512 12.512 9.6 35.648-6.464 51.712L557.248 512 709.184 663.936z"
                                            p-id="2652"></path>
                                    </svg>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/*可选频道*/}
            <div className={Style.channel}>
                <div className={Style.my_channel_tit}>
                    可选频道:
                </div>
                <div className={Style.my_channel_list}>
                    {
                        props.chooseChannelList?.map(item => (
                            <div key={item.id} className={Style.my_channel_item} onClick={() => addChannel(item)}>
                                <span>+ {item.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Channels;