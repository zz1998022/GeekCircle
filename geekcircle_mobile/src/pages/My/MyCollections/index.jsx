import {useNavigate} from "react-router-dom";
import {List , Empty , InfiniteScroll} from "antd-mobile";
import {useEffect, useState} from "react";
import service from "../../../request/axios";
import {getDay} from "../../../utils/day";
import './MyCollections.css';
import Top from "../../../components/Top";

function MyCollections(){
    const navigate = useNavigate();

    //本地token获取
    const token = localStorage.getItem('mobile_token');

    //收藏列表
    const [collections,setCollections] = useState([]);
    //页数
    const [page , setPage] = useState(1);
    //是否能加载更多
    const [hasMore,setHasMore] = useState(true);


    useEffect(() => {
        if(token === null){
            navigate('/login');
        }
        getCollections();
    },[token])

    //获取用户收藏列表
    const getCollections = () => {
        setPage(page+1);
        return service({
            url: '/article/collections',
            type: 'GET',
            params: {
                page
            }
        }).then((result) => {
            if(page === 1){
                setCollections(result.results);
            }else{
                setCollections([...collections , ...result.results]);
            }
            setHasMore(result.results.length > 0)
        });
    }

    return (
        <>
            {/*标题*/}
            <Top title="我的收藏"/>
            {/*列表*/}
            {collections.length <= 0 ? (<Empty description='暂无数据' />):
                (<>
                    <List>
                        {
                            collections?.map((item,index) => (
                                <List.Item key={index}>
                                    <div className="collection_item" onClick={() => navigate('/article/'+item.art_id)}>
                                        <h3>{item.title}</h3>
                                        <div className="info_box">
                                            <span>{item.aut_name}</span>
                                            <span>{item.comm_count}评论</span>
                                            <span>{getDay(item.pubdate)}</span>
                                        </div>
                                    </div>
                                </List.Item>
                            ))
                        }
                    </List>
                    <InfiniteScroll loadMore={getCollections} hasMore={hasMore} />
                </>)}
        </>
    )
}

export default MyCollections;