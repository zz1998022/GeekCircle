import {NavBar, Space, Divider, Empty, Popup, Toast , Badge} from "antd-mobile";
import {MoreOutline, EditSOutline , MessageOutline , LikeOutline , HeartOutline , UploadOutline} from "antd-mobile-icons";
import {useNavigate , useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import service from "../../request/axios";
import './Article.css';
import {getDate, getDay} from "../../utils/day";
import {throttle} from 'lodash';

function Article(){
    const navigate = useNavigate();
    const token = localStorage.getItem('mobile_token');
    //获取路由id
    const routeParam = useParams();
    //可滚动区域
    const wrapperRef = useRef(null);
    //导航作者信息
    const authorRef = useRef(null);
    //评论区域
    const commentRef = useRef(null);
    const isShowComment = useRef(false);
    //是否在导航栏显示作者信息
    const [isAuthor,setIsAuthor] = useState(false);
    //文章详情
    const [articleInfo,setArticleInfo] = useState({});
    //回复弹出层
    const [replyVisible,setReplyVisible] = useState(false);
    //分享弹出层
    const [shareVisible,setShareVisible] = useState(false);
    //评论弹出层
    const [commentVisible , setCommentVisible] = useState(false);
    //评论列表
    const [comment,setComment] = useState({});
    //回复列表
    const [reply,setReply] = useState({});
    //点击回复后当前评论
    const [nowComment,setNowComment] = useState({});
    //评论内容
    const [commentContent,setCommentContent] = useState('');


    //监听变化
    useEffect(() => {
        getArticle();
        getComment('a');
    },[])


    useEffect(() => {
        const authorDOM = authorRef.current;

        //创建节流函数
        const handleScroll = throttle(() => {
            const { bottom } = authorDOM.getBoundingClientRect();
            if(bottom - 45 <= 0){
                setIsAuthor(true);
            }else{
                setIsAuthor(false);
            }
        },200);

        window.addEventListener('scroll',handleScroll);
        return () => window.removeEventListener('scroll',handleScroll);
    },[])

    //获取文章详情
    const getArticle = () => {
        service.get(`/articles/${routeParam.id}`).then((result) => {
            setArticleInfo(result);
        })
    }

    //到达评论区域
    const onShowComment = () => {
        //获取评论区域高度
        const commentDOM = commentRef.current;
        const commentTop = commentDOM.getBoundingClientRect().top;
        if(!isShowComment.current){
            window.scrollTo({
                top: commentTop,
                behavior: 'auto'
            });
            isShowComment.current = true;
        }else{
            window.scrollTo(0,0);
            isShowComment.current = false;
        }
    }

    //文章详情导航左侧
    const left = isAuthor ? (
        <div className="author">
            <div>
                <img src={articleInfo.aut_photo} alt=""/>
            </div>
            <p>{articleInfo.aut_name}</p>
            <p className="follow" onClick={() => changeFollowing()}>{articleInfo.is_followed ? '取消关注' : '关注'}</p>
        </div>
    ) : '';

    //文章详情导航右侧
    const right = (
        <div style={{ fontSize: 24 }} onClick={() => setShareVisible(true)}>
            <Space style={{ '--gap': '16px' }}>
                <MoreOutline />
            </Space>
        </div>
    )

    //评论导航右侧
    const commentRight = (
        <div className="articles_comment_pup_right" onClick={() => addComment()}>
            <span>发表</span>
        </div>
    )

    //点赞
    const onLike = () => {
        if(token === null){
            navigate('/login');
            return;
        }
        console.log(articleInfo.attitude)
        //点赞
        if(articleInfo.attitude <= 0){
            service.post('/article/likings',{
                target: articleInfo.art_id
            }).then(() => {
                Toast.show({
                    icon: 'success',
                    content: '点赞成功',
                })
                getArticle();
            })
        }else{
            //取消点赞
            service.delete(`/article/likings/${articleInfo.art_id}`).then(() => {
                Toast.show({
                    icon: 'success',
                    content: '取消点赞',
                })
                getArticle();
            })
        }
    }

    //收藏
    const onCol = () => {
        if(token === null){
            navigate('/login');
            return;
        }
        if(!articleInfo.is_collected){
            service.post('/article/collections',{
                target: articleInfo.art_id
            }).then(() => {
                Toast.show({
                    icon: 'success',
                    content: '收藏成功',
                })
                getArticle();
            })
        }else{
            //取消点赞
            service.delete(`/article/collections/${articleInfo.art_id}`).then(() => {
                Toast.show({
                    icon: 'success',
                    content: '取消收藏',
                })
                getArticle();
            })
        }
    }

    //关注
    const changeFollowing = () => {
        if(token === null){
            navigate('/login');
            return;
        }
        //创建新对象
        let user = {};

        //判断用户是当前文章用户还是回复用户
        if(nowComment.aut_id){
            user = nowComment;
        }else{
            user = articleInfo
        }

        //关注此用户
        if(!user.is_followed){
            service.post('/user/followings',{
                target: user.aut_id
            }).then((result) => {
                if(result.message === '自己不能关注自己'){
                    Toast.show({
                        icon: 'error',
                        content: '操作失败',
                    })
                }else{
                    if(comment.results){
                        setNowComment({...nowComment,is_followed:!user.is_followed})
                    }
                    Toast.show({
                        icon: 'success',
                        content: '关注成功',
                    })
                }

            })
        }else{
            //取消关注
            service.delete(`/user/followings/${user.aut_id}`).then(() => {
                if(comment.results){
                    setNowComment({...nowComment,is_followed:!user.is_followed})
                }
                Toast.show({
                    icon: 'success',
                    content: '取消关注',
                })
            })
        }
    }

    //给评论点赞
    const onCommentLike = (like,target,type) => {
        if(token === null){
            navigate('/login');
            return;
        }
        if(!like){
            service.post('/comment/likings',{
                target
            }).then(() => {
                if(type === 'a'){
                    getComment('a');
                    setNowComment({...nowComment,is_liking:!like})
                }else{
                    getComment('c',nowComment.com_id)
                }
            })
        }else{
            service.delete(`/comment/likings/${target}`).then(() => {
                if(type === 'a'){
                    getComment('a');
                    setNowComment({...nowComment,is_liking:!like})
                }else{
                    getComment('c',nowComment.com_id)
                }
            });
        }
    }

    //获取评论
    const getComment = (type,replyId) => {
        let id = '';
        if(type === 'a'){
            id = routeParam.id;
        }else{
            id = replyId
        }

        service({
            url: '/comments',
            type: 'GET',
            params: {
                type,
                source: id
            }
        }).then((result) => {
            if(type === 'a'){
                setComment(result);
            }else{
                setReply(result);
            }
        })
    }

    //添加评论
    const addComment = () => {
        if(token === null){
            navigate('/login');
            return;
        }
        if(nowComment.aut_id){
            service.post('/comments',{
                target: nowComment.com_id,
                content: commentContent,
                art_id: routeParam.id
            }).then((result) => {
                setCommentContent('');
                setCommentVisible(false);
                getComment('a');
                getComment('c',nowComment.com_id);
            })
        }else{
            service.post('/comments',{
                target: routeParam.id,
                content: commentContent
            }).then(() => {
                setCommentContent('');
                setCommentVisible(false);
                getComment('a');
            })
        }

    }

    return (
        <>
            <div className="articles_wrapper">
                {/*顶部*/}
                <div className="articles_header">
                    <NavBar left={left} right={right} onBack={() => navigate(-1)} />
                    <Divider />
                </div>
                {/*内容*/}
                <div className="articles_main" ref={wrapperRef}>
                    {/*内容顶部*/}
                    <div className="articles_main_header">
                        <h3 className="articles_main_header_tit">{articleInfo.title}</h3>
                        <p className="articles_main_header_num">
                            <span>{getDate(articleInfo.pubdate)}</span>
                            <span>{articleInfo.read_count} 阅读</span>
                            <span>{articleInfo.comm_count} 评论</span>
                        </p>
                        <div className="articles_main_header_author" ref={authorRef}>
                            <div>
                                <img src={articleInfo.aut_photo} alt=""/>
                            </div>
                            <p>{articleInfo.aut_name}</p>
                            <button onClick={changeFollowing}>{articleInfo.is_followed ? '取消关注' : '+关注'}</button>
                        </div>
                    </div>
                    {/*文章内容*/}
                    <div className="articles_main_content">
                        <Divider />
                        <div dangerouslySetInnerHTML={{
                            __html:articleInfo.content
                        }} />
                        <div className="time">发布文章时间：{getDate(articleInfo.pubdate)}</div>
                    </div>
                    <div className="space" />
                    {/*评论*/}
                    <div className="comment" ref={commentRef}>
                        <div className="comment_header">
                            <p>全部评论（{comment.results?.length}）</p>
                            <p>{articleInfo.like_count} 点赞</p>
                        </div>
                        <div className="comment_list">
                            {comment.results?.length <= 0 ? (
                                <Empty description='还没有人评论哦'/>
                            ) : (
                                <>
                                    {comment.results?.map(item => (
                                        <div key={item.com_id} className='item'>
                                            <div className="avator">
                                                <img src={item.aut_photo} alt=""/>
                                            </div>
                                            <div className="info">
                                                <p>
                                                    <span className="comment_info_name">
                                                        {item.aut_name}
                                                    </span>
                                                    <span className="like">
                                                        <span>{item.like_count}</span>
                                                        <div onClick={() => onCommentLike(item.is_liking,item.com_id,'a')}>
                                                            {item.is_liking ? (
                                                                    <svg t="1652875736226" className="icon"
                                                                         viewBox="0 0 1024 1024" version="1.1"
                                                                         xmlns="http://www.w3.org/2000/svg" p-id="4126"
                                                                         width="20" height="20"><path
                                                                        d="M537.6 154.688l-13.632-0.256a96 96 0 0 0-94.72 72.704l-39.552 158.208a32 32 0 0 1-31.04 24.256H281.6a96 96 0 0 0-96 96v256a96 96 0 0 0 96 96h457.856a96 96 0 0 0 94.656-80.128l42.624-254.144a96 96 0 0 0 1.28-15.488l-0.384-9.28a96 96 0 0 0-95.232-87.104l-135.872-0.64a32 32 0 0 1-31.68-35.2l12.48-125.312 0.128-2.816A91.328 91.328 0 0 0 537.6 154.688z m-14.72 63.744l13.696 0.256c13.44 0.192 24.384 10.048 26.496 22.848l0.32 6.016-15.744 156.8a64 64 0 0 0 63.424 70.4l171.072 0.704a32 32 0 0 1 31.424 37.312l-42.56 254.08a32 32 0 0 1-31.552 26.752H281.6a32 32 0 0 1-32-32v-256a32 32 0 0 1 32-32h77.056a96 96 0 0 0 93.12-72.704l39.552-158.208a32 32 0 0 1 31.552-24.256z"
                                                                        fill="#FF7960" p-id="4127"></path></svg>
                                                            ):(
                                                                <svg t="1652876063372" className="icon"
                                                                viewBox="0 0 1024 1024" version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg" p-id="4995"
                                                                width="20" height="20">
                                                                <path
                                                                d="M621.67 408.025c16.623-74.241 28.228-127.936 34.837-161.196 16.641-83.742-26.57-161.496-112.207-161.496-77.237 0-116.01 38.382-138.886 115.095l-0.582 2.248c-13.725 62.048-34.72 110.155-62.511 144.577-29.397 36.41-73.174 57.97-119.733 58.965l-21.904 0.468c-52.244 1.117-94.017 44.131-94.017 96.81v317.837c0 64.802 52.11 117.334 116.392 117.334h412.522c84.739 0 160.38-53.563 189.123-133.922l85.697-239.587c21.805-60.96-9.54-128.196-70.012-150.177a115.556 115.556 0 0 0-39.48-6.956H621.67z m-77.41-258.692c39.258 0 59.498 36.474 49.884 84.925-7.57 38.148-21.987 104.43-43.217 198.67-4.511 20.026 10.565 39.097 30.907 39.097h218.657c6.11 0 12.172 1.07 17.92 3.162 27.446 9.991 41.673 40.553 31.776 68.262l-85.57 239.587c-19.638 54.982-71.316 91.63-129.21 91.63H223.494c-29.176 0-52.827-23.877-52.827-53.333V503.495c0-17.86 14.142-32.444 31.83-32.823l21.87-0.468c65.088-1.394 126.285-31.576 167.38-82.551 34.347-42.605 59.146-99.315 74.865-169.877 15.487-51.444 32.941-68.443 77.649-68.443z"
                                                                p-id="4996"></path></svg>
                                                            )}
                                                        </div>
                                                    </span>
                                                </p>
                                                <p className="content">{item.content}</p>
                                                <p>
                                                    <span className="reply" onClick={() => {
                                                        getComment('c',item.com_id);
                                                        setNowComment(item);
                                                        setReplyVisible(true);
                                                    }}>
                                                        {item.reply_count === 0 ? '' : item.reply_count}回复
                                                        <i>{'>'}</i>
                                                    </span>
                                                    <span className="time">{getDay(item.pubdate)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/*底部*/}
                <div className="articles_footer">
                    {/*评论框*/}
                    <div className="articles_footer_field" onClick={() => setCommentVisible(true)}>
                        <div className="van_field_left_icon">
                            <i className="van_icon"><EditSOutline className="articles_footer_icon"/></i>
                        </div>
                        <div className="van_cell_value">
                            <div className="van_field_body">
                                <input type="text"
                                       placeholder="抢沙发..."
                                       className="van_field_control"
                                />
                            </div>
                        </div>
                    </div>
                    {/*图标*/}
                    <div className="tt_icon" onClick={onShowComment}>
                        <Badge content={comment.total_count === 0 ? '' : comment.total_count} style={{ '--top': '5px' }}>
                            <MessageOutline className="icon"/>
                        </Badge>
                        <span>评论</span>
                    </div>
                    <div className="tt_icon" onClick={onLike}>
                        <LikeOutline className={`${articleInfo.attitude === 1 ? 'isActive' : ''} icon`}/>
                        <span>点赞</span>
                    </div>
                    <div className="tt_icon" onClick={onCol}>
                        <HeartOutline className={`${articleInfo.is_collected ? 'isActive' : ''} icon`}/>
                        <span>收藏</span>
                    </div>
                    <div className="tt_icon" onClick={() => setShareVisible(true)}>
                        <UploadOutline className="icon"/>
                        <span>分享</span>
                    </div>
                </div>
            </div>

            {/*分享弹出层*/}
            <Popup
                visible={shareVisible}
                onMaskClick={() => {
                    setShareVisible(false)
                }}
                bodyStyle={{
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    minHeight: '40vh',
                }}
            >
                <div className="share_header">
                    <h2>立即分享给好友</h2>
                </div>
                <div className="share_options">
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-wechat.png" alt=""/>
                        <span>微信</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-wechat-moments.png" alt=""/>
                        <span>朋友圈</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-weibo.png" alt=""/>
                        <span>微博</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-qq.png" alt=""/>
                        <span>QQ</span>
                    </div>
                </div>
                <Divider />
                <div className="share_options">
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-link.png" alt=""/>
                        <span>复制链接</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-poster.png" alt=""/>
                        <span>分享海报</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-qrcode.png" alt=""/>
                        <span>二维码</span>
                    </div>
                    <div role="button" className="share_sheet_options">
                        <img src="https://img01.yzcdn.cn/vant/share-sheet-weapp-qrcode.png" alt=""/>
                        <span>小程序码</span>
                    </div>
                </div>
                <div className="space" />
                <button className="share_cancel" onClick={() => setShareVisible(false)}>取消</button>
            </Popup>


            {/*回复弹出层*/}
            <Popup
                visible={replyVisible}
                onMaskClick={() => {
                    setReplyVisible(false)
                }}
                position='right'
                bodyStyle={{ width: '100vw' }}
            >
                <div className="articles_pup_header">
                    <NavBar onBack={() => {
                        setNowComment({});
                        setReplyVisible(false)
                    }}>{reply.total_count} 条回复</NavBar>
                    <Divider />
                </div>
                <div className="articles_pup_reply">
                    <div className='item'>
                    <div className="avator">
                        <img src={nowComment.aut_photo} alt=""/>
                    </div>
                    <div className="info">
                        <p className="reply_info">
                          <span className="comment_info_name">{nowComment.aut_name}</span>
                          <p className={"reply_follow"} onClick={() => changeFollowing()}>{nowComment.is_followed ? '取消关注' : '关注'}</p>
                        </p>
                        <p className="content">{nowComment.content}</p>
                        <p>
                            <span className="reply_time time">{getDay(nowComment.pubdate)}</span>
                            <span className="like">
                                <span>{nowComment.like_count}</span>
                                <div onClick={() => onCommentLike(nowComment.is_liking,nowComment.com_id,'a')}>
                                {nowComment.is_liking ? (
                                    <svg t="1652875736226" className="icon"
                                         viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="4126"
                                         width="20" height="20"><path
                                        d="M537.6 154.688l-13.632-0.256a96 96 0 0 0-94.72 72.704l-39.552 158.208a32 32 0 0 1-31.04 24.256H281.6a96 96 0 0 0-96 96v256a96 96 0 0 0 96 96h457.856a96 96 0 0 0 94.656-80.128l42.624-254.144a96 96 0 0 0 1.28-15.488l-0.384-9.28a96 96 0 0 0-95.232-87.104l-135.872-0.64a32 32 0 0 1-31.68-35.2l12.48-125.312 0.128-2.816A91.328 91.328 0 0 0 537.6 154.688z m-14.72 63.744l13.696 0.256c13.44 0.192 24.384 10.048 26.496 22.848l0.32 6.016-15.744 156.8a64 64 0 0 0 63.424 70.4l171.072 0.704a32 32 0 0 1 31.424 37.312l-42.56 254.08a32 32 0 0 1-31.552 26.752H281.6a32 32 0 0 1-32-32v-256a32 32 0 0 1 32-32h77.056a96 96 0 0 0 93.12-72.704l39.552-158.208a32 32 0 0 1 31.552-24.256z"
                                        fill="#FF7960" p-id="4127"></path></svg>
                                ):(
                                    <svg t="1652876063372" className="icon"
                                         viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="4995"
                                         width="20" height="20">
                                        <path
                                            d="M621.67 408.025c16.623-74.241 28.228-127.936 34.837-161.196 16.641-83.742-26.57-161.496-112.207-161.496-77.237 0-116.01 38.382-138.886 115.095l-0.582 2.248c-13.725 62.048-34.72 110.155-62.511 144.577-29.397 36.41-73.174 57.97-119.733 58.965l-21.904 0.468c-52.244 1.117-94.017 44.131-94.017 96.81v317.837c0 64.802 52.11 117.334 116.392 117.334h412.522c84.739 0 160.38-53.563 189.123-133.922l85.697-239.587c21.805-60.96-9.54-128.196-70.012-150.177a115.556 115.556 0 0 0-39.48-6.956H621.67z m-77.41-258.692c39.258 0 59.498 36.474 49.884 84.925-7.57 38.148-21.987 104.43-43.217 198.67-4.511 20.026 10.565 39.097 30.907 39.097h218.657c6.11 0 12.172 1.07 17.92 3.162 27.446 9.991 41.673 40.553 31.776 68.262l-85.57 239.587c-19.638 54.982-71.316 91.63-129.21 91.63H223.494c-29.176 0-52.827-23.877-52.827-53.333V503.495c0-17.86 14.142-32.444 31.83-32.823l21.87-0.468c65.088-1.394 126.285-31.576 167.38-82.551 34.347-42.605 59.146-99.315 74.865-169.877 15.487-51.444 32.941-68.443 77.649-68.443z"
                                            p-id="4996"></path></svg>
                                )}
                            </div>
                            </span>
                        </p>
                    </div>
                </div>
                    <p className="reply_all_tit">全部回复</p>
                    <div className="comment_list reply_list">
                    {reply.results?.length <= 0 ? (
                        <Empty description='还没有人回复哦'/>
                    ) : (
                        <>
                            {reply.results?.map(item => (
                                <div key={item.com_id} className='item'>
                                    <div className="avator">
                                        <img src={item.aut_photo} alt=""/>
                                    </div>
                                    <div className="info">
                                        <p>
                                            <span className="comment_info_name">{item.aut_name}</span>
                                            <span className="like">
                                                <span>{item.like_count}</span>
                                                <div onClick={() => onCommentLike(item.is_liking,item.com_id,'c')}>
                                                            {item.is_liking ? (
                                                                <svg t="1652875736226" className="icon"
                                                                     viewBox="0 0 1024 1024" version="1.1"
                                                                     xmlns="http://www.w3.org/2000/svg" p-id="4126"
                                                                     width="20" height="20"><path
                                                                    d="M537.6 154.688l-13.632-0.256a96 96 0 0 0-94.72 72.704l-39.552 158.208a32 32 0 0 1-31.04 24.256H281.6a96 96 0 0 0-96 96v256a96 96 0 0 0 96 96h457.856a96 96 0 0 0 94.656-80.128l42.624-254.144a96 96 0 0 0 1.28-15.488l-0.384-9.28a96 96 0 0 0-95.232-87.104l-135.872-0.64a32 32 0 0 1-31.68-35.2l12.48-125.312 0.128-2.816A91.328 91.328 0 0 0 537.6 154.688z m-14.72 63.744l13.696 0.256c13.44 0.192 24.384 10.048 26.496 22.848l0.32 6.016-15.744 156.8a64 64 0 0 0 63.424 70.4l171.072 0.704a32 32 0 0 1 31.424 37.312l-42.56 254.08a32 32 0 0 1-31.552 26.752H281.6a32 32 0 0 1-32-32v-256a32 32 0 0 1 32-32h77.056a96 96 0 0 0 93.12-72.704l39.552-158.208a32 32 0 0 1 31.552-24.256z"
                                                                    fill="#FF7960" p-id="4127"></path></svg>
                                                            ):(
                                                                <svg t="1652876063372" className="icon"
                                                                     viewBox="0 0 1024 1024" version="1.1"
                                                                     xmlns="http://www.w3.org/2000/svg" p-id="4995"
                                                                     width="20" height="20">
                                                                    <path
                                                                        d="M621.67 408.025c16.623-74.241 28.228-127.936 34.837-161.196 16.641-83.742-26.57-161.496-112.207-161.496-77.237 0-116.01 38.382-138.886 115.095l-0.582 2.248c-13.725 62.048-34.72 110.155-62.511 144.577-29.397 36.41-73.174 57.97-119.733 58.965l-21.904 0.468c-52.244 1.117-94.017 44.131-94.017 96.81v317.837c0 64.802 52.11 117.334 116.392 117.334h412.522c84.739 0 160.38-53.563 189.123-133.922l85.697-239.587c21.805-60.96-9.54-128.196-70.012-150.177a115.556 115.556 0 0 0-39.48-6.956H621.67z m-77.41-258.692c39.258 0 59.498 36.474 49.884 84.925-7.57 38.148-21.987 104.43-43.217 198.67-4.511 20.026 10.565 39.097 30.907 39.097h218.657c6.11 0 12.172 1.07 17.92 3.162 27.446 9.991 41.673 40.553 31.776 68.262l-85.57 239.587c-19.638 54.982-71.316 91.63-129.21 91.63H223.494c-29.176 0-52.827-23.877-52.827-53.333V503.495c0-17.86 14.142-32.444 31.83-32.823l21.87-0.468c65.088-1.394 126.285-31.576 167.38-82.551 34.347-42.605 59.146-99.315 74.865-169.877 15.487-51.444 32.941-68.443 77.649-68.443z"
                                                                        p-id="4996"></path></svg>
                                                            )}
                                                        </div>
                                            </span>
                                        </p>
                                        <p className="content">{item.content}</p>
                                        <p>
                                            <span className="time">{getDay(item.pubdate)}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                    <div className="articles_footer">
                    {/*评论框*/}
                    <div className="articles_footer_field" onClick={() => setCommentVisible(true)}>
                        <div className="van_field_left_icon">
                            <i className="van_icon"><EditSOutline className="articles_footer_icon"/></i>
                        </div>
                        <div className="van_cell_value">
                            <div className="van_field_body">
                                <input type="text"
                                       placeholder="抢沙发..."
                                       className="van_field_control"
                                />
                            </div>
                        </div>
                    </div>
                    {/*图标*/}
                    <div className="tt_icon">
                        <HeartOutline/>
                        <span>收藏</span>
                    </div>
                    <div className="tt_icon">
                        <UploadOutline className="icon"/>
                        <span>分享</span>
                    </div>
                </div>
                </div>
            </Popup>

            {/*评论弹出层*/}
            <Popup
                visible={commentVisible}
                onMaskClick={() => {
                    setCommentVisible(false)
                }}
                bodyStyle={{
                    minHeight: '100vh',
                }}
            >
                <div className="articles_pup_header">
                    <NavBar right={commentRight} onBack={() => setCommentVisible(false)}>评论文章</NavBar>
                    <Divider />
                </div>
                <div className="articles_pup_comment_content">
                    <div className="articles_pup_comment_value">
                        <div className="articles_pup_comment_body">
                            <textarea className="articles_pup_comment_control"
                                      cols="30"
                                      rows="10"
                                      placeholder={nowComment.aut_name ? `@${nowComment.aut_name}: ` : "说点什么~"}
                                      value={commentContent}
                                      onChange={(e) => setCommentContent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default Article;