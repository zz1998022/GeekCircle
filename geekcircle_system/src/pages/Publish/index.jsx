import {Breadcrumb, Card, Form, Input, Radio, Upload, Select, message, Modal, Button} from "antd";
import {getArticleDetail, getChannels} from '../../api/articles';
import {useEffect, useState} from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Editor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import axios from "axios";
import service from "../../request/axios";
import {useNavigate , useLocation} from "react-router-dom";
import {upload} from "@testing-library/user-event/dist/upload";

const { Option } = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function Publish(){
    const [form] = Form.useForm();
    const navigate = useNavigate();
    //频道列表
    const [channels , setChannels] = useState([]);
    //获取路由参数
    const location = useLocation();
    const id = location.pathname.split('/')[3];

    //表单数据
    const [title , setTitle] = useState('');
    const [cover , setCover] = useState(1);
    const [channelsId , setChannelsId] = useState('');
    //上传加载
    const [preview,setPreview] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
    })
    //上传文件数量
    const [maxCount,setMaxCount] = useState(1);
    const [fileList,setFileList] = useState([]);
    const [loading, setLoading] = useState();
    const [uploadList, setUploadList] = useState([]);

    //文档编辑器
    const [markText , setMarkText] = useState('');

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    );

    //初始化表单数据
    const [initialValues , setInitialValues] = useState({
        title: '',
        channel_id : [],
        cover : '1',
    });

    //是否存入草稿
    const [draft , setDraft] = useState(false);

    //初始化
    useEffect(() => {
        getChannels(setChannels);
    },[]);

    useEffect(() => {
        if(id !== undefined) {
            getArticle();
        }
    },[])

    const getArticle = () => {
        //获取文章详情
        getArticleDetail(id).then((result) => {
            form.setFieldsValue({
                title: result.title,
                channel_id: result.channel_id,
                cover: result.cover.type.toString(),
            })
            setMaxCount(result.cover.type);
            setFileList(result.cover.images.map(item => ({
                url: item
            })));
            setTitle(result.title);
            setCover(result.cover.type);
            setChannelsId(result.channel_id);
            setUploadList(result.cover.images.map(item => item));
            setMarkText(result.content);

        });
    }



    //图片上传数量设置
    const changePictureCount = e => {
        setCover(Number(e.target.value));
        switch (e.target.value){
            case '0':
                setMaxCount(0);
                break;
            case '1':
                setFileList(fileList.slice(0,1))
                setUploadList(uploadList.slice(0,1));
                setMaxCount(1);
                break;
            case '3':
                setMaxCount(3);
                break;
        }
    }

    //图片上传时
    const handleChange = ({ fileList }) => {
        const newFileList = fileList.map(item => {
            if(item.response){
                return item.response.data.url
            }else{
                return item.url;
            }
        })
        setUploadList(newFileList.map(item => item));
        setFileList(fileList);
    };

    //取消上传图片
    const handleCancel = () => setPreview({...preview , previewVisible: false });
    //	点击文件链接或预览图标时的回调
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreview({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //标题改变时
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    //单选改变时
    const onChangeSelect = (id) => {
        setChannelsId(id);
    }


    //表单提交事件
    const onFinish = (draft) => {
        // 创建请求参数对象
        const requestValue = {
            draft,
            title,
            content: markText,
            cover: {
                type: cover,
                images: uploadList
            },
            channel_id: channelsId
        }
        console.log(requestValue);
        if(id === undefined){
            //发起请求 添加数据
            service({
                method: "POST",
                url: "/mp/articles",
                data: requestValue
            }).then((result) => {
                draft ?  message.success("保存草稿成功") : message.success("添加成功");
                //跳转页面
                navigate('/home/article');
            })
        }else{
            //发起请求 添加数据
            service({
                method: "PUT",
                url: `/mp/articles/${id}`,
                data: requestValue
            }).then((result) => {
                draft ? message.success("保存草稿成功") : message.success("编辑成功");
                //跳转页面
                navigate('/home/article');
            })
        }

        return true;
    }

    return (
        <>
            <Card title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>{id === undefined ? '添加文章' : '编辑文章'}</Breadcrumb.Item>
                </Breadcrumb>
            } bordered={false} style={{padding: 20+'px'}}>
                <Form initialValues={initialValues} form={form}>
                    <Form.Item
                        style={{maxWidth: 500 + 'px'}}
                        name="title"
                        label="标题"
                        labelCol={{span: 3, offset: 6}}
                        rules={[{ required: true, message: '请输入标题!' }]}
                    >
                        <Input placeholder={"请输入文章标题"} onChange={onChangeTitle}/>
                    </Form.Item>
                    <Form.Item
                        style={{maxWidth: 500 + 'px'}}
                        name="channel_id"
                        label="频道"
                        labelCol={{span: 3, offset: 6}}
                        rules={[{ required: true, message: '请选择频道!' }]}
                    >
                        <Select placeholder="请选择文章频道" onChange={onChangeSelect}>
                            {
                                channels.map(item => {
                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="cover" label="封面" labelCol={{span: 1, offset: 3}}>
                        <Radio.Group onChange={changePictureCount}>
                            <Radio value="1">单图</Radio>
                            <Radio value="3">三图</Radio>
                            <Radio value="0">无图</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 10, offset: 4}}>
                    {maxCount !== 0 ? (
                        <>
                        <Upload
                                name="image"
                                action="http://geek.itheima.net/v1_0/upload"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={maxCount}
                            >
                                {uploadButton}
                            </Upload>
                            <Modal
                                visible={preview.previewVisible}
                                title={preview.previewTitle}
                                onCancel={handleCancel}
                            >
                                <img alt="example" style={{ width: '100%' }} src={preview.previewImage} />
                            </Modal>
                        </>
                        ) : ''}
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="内容"
                        labelCol={{span: 1.5, offset: 3}}
                        style={{maxWidth: 1000 + 'px'}}
                        rules={[{ required: true, message: '请输入内容!' }]}
                    >
                        <Editor
                            modelValue={markText}
                            onChange={(modelValue) => {
                                setMarkText(modelValue);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 5, offset: 4}}
                    >
                        <Button type="primary" size={"large"} style={{marginRight: 5+'px'}} onClick={() => onFinish(false)}>
                            {id === undefined ? '发布文章' : '编辑文章'}
                        </Button>
                        <Button type="default" size={"large"} style={{marginLeft: 5+'px'}} onClick={() => onFinish(true)}>
                            存入草稿
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default Publish;