import { Tabs , Popup } from 'antd-mobile'
import './Home.css';
import service from "../../request/axios";
import {useEffect, useState} from "react";
import {SearchOutline , UnorderedListOutline} from 'antd-mobile-icons';
import Bottom from '../../components/Bottom';
import {useNavigate} from "react-router-dom";
import HomeArticleItem from "../../components/HomeArticleItem";
import Channels from "../../components/Channels";
import _ from 'lodash';


function Home(){
    const navigate = useNavigate();
    //定义频道列表
    const [channelList,setChannelList] = useState([]);
    //当前tab id
    const [tabId,setTabId] = useState(0);
    //时间戳
    const [timestamp , setTimestamp] = useState(Date.now() + '');
    //推荐文章列表
    const [articles, setArticles] = useState([]);
    //频道列表弹出层
    const [channelVisible , setChannelVisible] = useState(false);
    //顶部栏选择的频道
    const [activeKey , setActiveKey] = useState(0);
    //选中的频道
    const [checkChId,setCheckChId] = useState(0);
    //可选频道
    const [chooseChannelList,setChooseChannelList] = useState([]);

    useEffect(() => {
        getTabs();
    },[])

    //请求顶部列表
    const getTabs = () => {
        //获取顶部列表
        service.get('/user/channels').then((result) => {
            setChannelList(result.channels);
            getChooseChannel(result.channels);
        })
    }

    //请求可选频道列表
    const getChooseChannel = (channelList) => {
        //发起请求
        service.get('/channels').then((result) => {
            const chooseList = _.differenceBy(result.channels,channelList,'id');
            setChooseChannelList(chooseList);
        });
    }

    //请求文章列表
    const getArticles = (channel_id,timestamp) => {
        setCheckChId(Number(channel_id));
        setActiveKey(channel_id);
        //获取推荐文章
        service({
            url: '/articles',
            params: {
                channel_id,
                timestamp
            }
        }).then((result) => {
            setArticles(result.results);
            setTimestamp(timestamp);
            setTabId(channel_id);
        });
    }

    return (
        <>
            <div className='home'>
                {/*顶部Tab栏*/}
                <Tabs
                    defaultActiveKey='0'
                    activeKey={activeKey}
                    activeLineMode='fixed'
                    className='tab'
                    style={{
                          '--fixed-active-line-width': '10px',
                      }}
                    onChange={(key) => getArticles(key,Date.now() + '')}
                >
                    {
                        channelList.map(item => (
                            <Tabs.Tab title={item.name} key={item.id} className={`${item.id === activeKey ? 'adm-tabs-tab-active' : ''}`}/>
                        ))
                    }
                </Tabs>

                <HomeArticleItem
                    articles={articles}
                    timestamp={timestamp}
                    tabId={tabId}
                    setArticles={setArticles}
                    getArticles={getArticles}/>

                <div className='top_features'>
                    <SearchOutline className='icon' onClick={() => navigate('/search')}/>
                    <UnorderedListOutline className='icon' onClick={() => setChannelVisible(true)}/>
                </div>
            </div>

            <Popup
                visible={channelVisible}
                onMaskClick={() => {
                    setChannelVisible(false)
                }}
                position='left'
                bodyStyle={{ width: '100vw' }}
            >
                <Channels
                    channelList={channelList}
                    checkChId={checkChId}
                    getArticles={getArticles}
                    chooseChannelList={chooseChannelList}
                    setChannelVisible={setChannelVisible}
                    setChannelList={setChannelList}
                    setChooseChannelList={setChooseChannelList}
                    getTabs={getTabs}
                />
            </Popup>

            <div className="bottom">
                <Bottom />
            </div>
        </>
    )
}
export default Home;