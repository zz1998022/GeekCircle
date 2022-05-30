//获取指定日期格式
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/zh-cn';
//设置中文
dayjs.locale('zh-cn')

export const getDay = (pubdate) => {
    pubdate = pubdate === '' ? '2000-10-15' : pubdate;
    dayjs.extend(relativeTime);
    return dayjs(pubdate).fromNow();
}

export const getDate = (pubdate) => {
    return dayjs(pubdate).format('YYYY-MM-DD');
}