import { Card , Breadcrumb , Form , DatePicker , Button,Select,Radio } from 'antd';

const { RangePicker } = DatePicker;

const { Option } = Select;


function ArticleFilter(props){
    return (
        <>
            {/*筛选列表*/}
            <Card title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                </Breadcrumb>
            } bordered={false}>
                <Form onFinish={props.onFinish} initialValues={props.initialValues}>
                    <Form.Item name="status" label="状态">
                        <Radio.Group>
                            <Radio value="all">全部</Radio>
                            <Radio value="0">草稿</Radio>
                            <Radio value="1">待审核</Radio>
                            <Radio value="2">审核通过</Radio>
                            <Radio value="3">审核失败</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        style={{maxWidth: 310 + 'px'}}
                        name="channel_id"
                        label="频道"
                    >
                        <Select placeholder="请选择文章频道">
                            {
                                props.channels.map(item => {
                                   return <Option value={item.id} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="range_picker" label="日期">
                        <RangePicker placeholder={['开始日期', '结束日期']}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}

export default ArticleFilter;