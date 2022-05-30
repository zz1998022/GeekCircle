import {InfiniteScroll, List, Modal, PullToRefresh, Toast} from "antd-mobile";
import {getDay} from "../../utils/day";
import {reports} from "../../api/home";
import service from "../../request/axios";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Style from './HomeArticleItem.module.css';

function ArticleItem(props){
    const navigate = useNavigate();
    //本地token获取
    const token = localStorage.getItem('mobile_token');

    //是否存在更多数据
    const [hasMore , setHasMore] = useState(true);


    //当前列表项 id
    const [articleId , setArticleId] = useState();
    //关闭弹框
    const [closeVisible,setCloseVisible] = useState(false);
    //反馈垃圾内容弹框
    const [reportVisible,setReportVisible] = useState(false);

    //删除选中项
    const closeItem = (target) => {
        setCloseVisible(true)
        setArticleId(target);
    }

    //判断是否存在token
    const isToken = () => {
        Toast.show({
            content: '操作失败',
        })
        navigate('/login');
    }

    //请求对文章不喜欢
    const reDonLike = () => {
        if(token === null){
            isToken();
        }else{
            service.post('/article/dislikes',{target:articleId}).then(() => {
                Toast.show({
                    content: '删除成功',
                })
                setReportVisible(false);
                setCloseVisible(false);
            })
        }
    }
    //请求举报文章
    const reReport = (type,remark) => {
        if(token === null){
            isToken();
        }else{
            service.post('/article/reports',{target:articleId,type,remark}).then(() => {
                Toast.show({
                    content: '举报成功',
                })
                const newArticleList = props.articles.filter((item) => item.art_id !== articleId);
                props.setArticles(newArticleList);
                setReportVisible(false);
                setCloseVisible(false);
            })
        }
    }

    //下拉加载更多
    const loadMore = () => {
        //获取更多文章
        return service({
            url: '/articles',
            params: {
                channel_id:props.tabId,
                timestamp:props.timestamp
            },
        }).then((result) => {
            props.setArticles([...props.articles,...result.results]);
            setHasMore(result.results.length > 0);
        })
    }

    //上拉刷新
    const onRefresh = () => {
        props.getArticles(props.tabId,Date.now() + '');
    }

    return (
        <PullToRefresh onRefresh={onRefresh}>
            <List className="articles">
                {props.articles?.map((item,index) => (
                    <List.Item key={index}>
                        <div className="collection_item" onClick={() => navigate('/article/'+item.art_id)}>
                            <h3 className={item.cover.type === 1 ? Style.w66 : ''}>{item.title}</h3>
                            {/*图片*/}
                            {item.cover.type > 0 ? item.cover.images.map(((cover,count) => (
                                    <div key={count} className="w33 van-image">
                                        <img src={cover} alt=""/>
                                    </div>
                                )))
                                : ''}
                            {/*底部*/}
                            <div className="info_box">
                                <span>{item.aut_name}</span>
                                <span>{item.comm_count}评论</span>
                                <span>{getDay(item.pubdate)}</span>
                                <span onClick={() => closeItem(item.art_id)} className={Style.article_close}>✖️</span>
                            </div>
                        </div>

                        <Modal
                            visible={closeVisible}
                            content={<List>
                                <List.Item><div onClick={() => setCloseVisible(false)}>返回</div></List.Item>
                                <List.Item><div onClick={reDonLike}>不感兴趣</div></List.Item>
                                <List.Item onClick={() => setReportVisible(true)}>反馈垃圾内容</List.Item>
                                <List.Item>拉黑作者</List.Item>
                            </List>}
                            closeOnMaskClick
                        />


                        <Modal
                            visible={reportVisible}
                            content={<List>
                                <List.Item><div onClick={() => setReportVisible(false)}>返回</div></List.Item>
                                {reports.map((reItem,reIndex) => (
                                    <List.Item key={reIndex}><div onClick={() => reReport(reItem.type,'')}>{reItem.type}</div></List.Item>
                                ))}
                            </List>}
                        />
                    </List.Item>
                ))}
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </List>
        </PullToRefresh>
    )
}

export default ArticleItem;