import {useState , useEffect} from "react";
import { Spin } from 'antd';
import ArticleFilter from '../../components/Article/ArticleFilters';
import ArticleTable from '../../components/Article/ArticleTable';
import service from "../../request/axios";
import { getChannels } from '../../api/articles';


function Article(){
    //初始化表单数据
    const [initialValues , setInitialValues] = useState({
        status: 'all',
        channel_id : [],
        range_picker : ''
    });
    //获取文章列表数据
    const [articleList,setArticleList] = useState([]);
    const [isLoading , setIsLoading] = useState(false);
    //频道列表
    const [channels , setChannels] = useState([]);

    useEffect(() => {
        getArticleList({});
        getChannels(setChannels);
    },[]);

    //筛选表单校验
    const onFinish = async (fieldsValue) => {
        let rangeValue = fieldsValue['range_picker'];
        rangeValue = rangeValue === null ? '' : rangeValue;

        const requestValue = {
            status: fieldsValue.status === 'all' ? '' : fieldsValue.status,
            channel_id: fieldsValue.channel_id,
            begin_pubdate: rangeValue[0]?.format('YYYY-MM-DD') || '',
            end_pubdate: rangeValue[1]?.format('YYYY-MM-DD') || '',
            page: articleList.page,
            per_page: articleList.per_page
        }
       getArticleList(requestValue);
    }

    //获取文章列表
    const getArticleList = (data) => {
        setIsLoading(true);
        service.get('/mp/articles',{
            params: data
        }).then((result) => {
            setArticleList(result.data);
            setIsLoading(false);
        });
    }

    //删除列表项
    const delArticle = (id) => {
        service.delete(`/mp/articles/${id}`).then(() => {
            getArticleList({});
        });
    }

    //更改页数
    const changePage = (page,per_page) => {
        setIsLoading(true);
        service.get(`http://toutiao.itheima.net/v1_0/mp/articles`,{
            params:{
                page,
                per_page
            }
        }).then((result) => {
            setArticleList(result.data);
            setIsLoading(false);
        });
    }

    return (
        <>
            <ArticleFilter
                onFinish={onFinish}
                initialValues={initialValues}
                channels={channels}
            />

            {isLoading ? <Spin /> :
                <ArticleTable
                articleList={articleList}
                changePage={changePage}
                delArticle={delArticle}
            />}
        </>
    )
}

export default Article;