//获取频道
import service from "../request/axios";

export const getChannels = (setChannels) => {
    service.get('/channels').then((result) => {
        setChannels(result.data.channels);
    });
}

//获取文章详情
export const getArticleDetail = async (id) => {
    const response = await service.get(`/mp/articles/${id}`);
    return response.data;
}
