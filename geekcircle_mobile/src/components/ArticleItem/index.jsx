import Style from "../HomeArticleItem/HomeArticleItem.module.css";
import {getDay} from "../../utils/day";
import {List , InfiniteScroll} from "antd-mobile";
import {useNavigate} from "react-router-dom";

function ArticleItem(props){
    const navigate = useNavigate();

    return (
        <>
            <List className="articles" style={{padding: 0}}>
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
                            </div>
                        </div>
                    </List.Item>
                ))}
                <InfiniteScroll loadMore={props.loadMore} hasMore={props.hasMore} />
            </List>
        </>
    )
}

export default ArticleItem;