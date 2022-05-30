import {Button, Table, Tag, Pagination, Card, Modal, message} from 'antd';
import {useMemo} from "react";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const { confirm } = Modal;

function ArticleTable(props){
    const navigate = useNavigate();
    const artList = useMemo(() => {
        props.articleList.results?.forEach((item) => {
            item.key = item.id
        });

        return props.articleList.results;

    },[props.articleList.results])

    //列表行配置
    const column =[
        {
            title: '封面',
            dataIndex: 'cover',
            key: 'cover',
            render: cover => (
                <img src={cover.images[0] ? cover.images[0] : 'data:image/png;base64,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'} alt="" style={{width: 200 +'px' , height: 150 + 'px'}}/>
            ),
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <>
                    {(() => {
                        switch (status) {
                            case 0:
                                return <Tag color={"processing"}>草稿</Tag>;
                            case 1:
                                return <Tag color={"warning"}>待审核</Tag>;
                            case 2:
                                return <Tag color={"success"}>审核通过</Tag>;
                            case 3:
                                return <Tag color={"error"}>审核失败</Tag>;
                            default:
                                return <Tag color={"default"}>全部</Tag>;
                        }
                    })()}
                </>
            )
        },
        {
            title: '发布时间',
            key: 'pubdate',
            dataIndex: 'pubdate',
        },
        {
            title: '阅读数',
            key: 'read_count',
            dataIndex: 'read_count',
        },
        {
            title: '评论数',
            key: 'comment_count',
            dataIndex: 'comment_count',
        },
        {
            title: '点赞数',
            key: 'like_count',
            dataIndex: 'like_count',
        },
        {
            title: '操作',
            key: 'id',
            dataIndex: 'id',
            render: id => (
                <>
                    <Button type="primary" shape="circle" style={{margin: 5 + 'px'}} onClick={() => editModal(id)}>
                        <EditOutlined />
                    </Button>
                    <Button type="primary" shape="circle" danger  style={{margin: 5 + 'px'}} onClick={() => delModal(id)}>
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        }
    ]

    //删除弹框配置
    const delModal = (id) => {
        confirm({
            title: '温馨提示',
            content: (
                <span>此操作将永久删除该文章, 是否继续？</span>
            ),
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                //删除列表项
                props.delArticle(id);
                message.success("删除成功");
            },
        });
    }


    //修改弹框配置
    const editModal = (id) => {
        navigate(`/home/publish/${id}`);
    }

   return (
           <Card
               title={
                   <span>根据筛选条件共查询到 {props.articleList.total_count} 条结果：</span>
               }
               bordered={false}
               style={{padding: 16+'px' , background: '#fff' , marginTop: 30 + 'px'}}>
               <Table columns={column} dataSource={artList} pagination={false}/>
               <Pagination
                   current={props.articleList.page}
                   defaultCurrent={1}
                   total={props.articleList.total_count}
                   pageSize={props.articleList.per_page ? props.articleList.per_page : 10}
                   onChange={props.changePage}
                   style={{
                   background: '#fff' ,
                   paddingTop: 16+'px',
                   paddingBottom: 16+'px',
                   display: 'flex',
                   justifyContent: 'center',
               }}/>
           </Card>
   )
}

export default ArticleTable;