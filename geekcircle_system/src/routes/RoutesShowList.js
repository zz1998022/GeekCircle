import {HomeOutlined , DiffOutlined , EditOutlined} from '@ant-design/icons'


export const RoutesShowList = [
    {
        path: '/home',
        key: 'home',
        name: '数据概览',
        icon: <HomeOutlined />,
    },
    {
        path: '/home/article',
        key: 'article',
        name: '内容管理',
        icon: <DiffOutlined />,
    },
    {
        path: '/home/publish',
        key: 'publish',
        name: '发布文章',
        icon: <EditOutlined />,
    },
];