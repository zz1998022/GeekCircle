import {Divider, NavBar , Popup} from "antd-mobile";
import {useState} from "react";
import {SearchOutline , DeleteOutline , CloseOutline} from "antd-mobile-icons";
import {useNavigate} from "react-router-dom";
import './Search.css';
import service from "../../request/axios";
import {heighSug} from "../../utils/heighSug";
import ArticleItem from "../../components/ArticleItem";

function Search(){
    const navigate = useNavigate();
    //搜索内容
    const [input,setInput] = useState("");
    //建议
    const [suggestion,setSuggestion] = useState([]);
    //搜索弹框
    const [searchVisible,setSearchVisible] = useState(false);
    //搜索结果列表
    const [searchList , setSearchList] = useState([]);
    //加载更多
    const [hasMore,setHasMore] = useState(true);
    //页数
    const [page , setPage] = useState(1);
    //获取历史搜索数据
    const [history,setHistory] = useState(JSON.parse(localStorage.getItem('search_history')) || []);
    //顶部右侧样式
    const right = (
        <span className={"search_right"} onClick={() => searching()}>搜索</span>
    );

    //回退
    const back = () => {
        setPage(1);
        setInput("");
        setSearchList([]);
        setSearchVisible(false)
    }

    //获取搜索建议
    const getSuggestion = (e) => {
        setInput(e.target.value);
        if(e.target.value === '') return;

        service({
            url: '/suggestion',
            params: {
                q:e.target.value
            }
        }).then((result) => {
            setSuggestion(result.options);
        })
    }

    //将搜索添加到本地
    const addHisLoc = (q) => {
        console.log(q);
        setHistory( q === undefined ? [...history,input] : [...history,q])

        //去重
        let arr = q === undefined ? [...history,input] : [...history,q];
        let newArr = [];
        for(let i = 0; i < arr.length; i++){
            if(newArr.indexOf(arr[i]) === -1){
                newArr.push(arr[i]);
            }
        }
        localStorage.setItem('search_history',JSON.stringify(newArr));
    }

    //点击搜索
    const searching = () => {
        addHisLoc()
        setSearchVisible(true);
        searchResult(input);
    }

    //点击模糊搜索
    const searchSuggest = (q) => {
        addHisLoc(q)
        setSearchVisible(true);
        searchResult(q);
    }

    //获取搜索结果
    const searchResult = (q) => {
        setPage(page+1);

        return service({
            url: '/search',
            params: {
                q,
                page
            }
        }).then((result) => {
            if(page === 1){
                setSearchList(result.results);
            }else{
                setSearchList([...searchList,...result.results]);
            }
            setHasMore(result.results.length > 0);
        })
    }

    //删除单个历史记录
    const delHistoryOne = (id) => {
        const arr = history.filter((item,index) => index !== id);
        setHistory(arr);
        localStorage.setItem('search_history',JSON.stringify(arr));
    }

    //删除所有历史记录
    const delHistoryAll = () => {
        setHistory([]);
        localStorage.setItem('search_history',JSON.stringify([]));
    }

    return (
        <>
            {/*搜索栏*/}
            <div className="top">
                <NavBar onBack={() => navigate(-1)} right={right}>
                    <div className="van_field van_cell">
                        <div className="van_field_left_icon">
                            <i className="van_search_icon"><SearchOutline className={'search_icon'}/></i>
                        </div>
                        <div className="van_cell_value">
                            <div className="van_field_body">
                                <input type="text"
                                       placeholder="请输入搜索关键字"
                                       className="van_field_control"
                                       value={input}
                                       onChange={(e) => getSuggestion(e)}
                                />
                            </div>
                        </div>
                    </div>
                </NavBar>
                <Divider />
            </div>
            {/*模糊搜索*/}
            <div className={`${input === '' ? "suggest_display" : ""} suggest_box`}>
                {suggestion[0] !== null ? suggestion?.map((item,index) => (
                    <div key={index} className={'search_sug_cell'} onClick={() => searchSuggest(item)}>
                        <i className="search_sug_icon"><SearchOutline className={'search_icon'}/></i>
                        <div>
                            {heighSug(item,input)}
                        </div>
                    </div>
                    )) : ''}
            </div>
            {/*历史记录*/}
            <div className={`${history.length > 0 ? '': 'suggest_display'} history_box`}>
                <div className="head">
                    <span>历史记录</span>
                    <i onClick={delHistoryAll}><DeleteOutline /></i>
                </div>
                <div className="history_content">
                    {
                        history?.map((item,index) => (
                            <div key={index} className="history_item">
                                <a href="#" onClick={() => {
                                    setSearchVisible(true);
                                    searchResult(item)
                                }}>{item}</a>
                                <i onClick={() => delHistoryOne(index)}><CloseOutline /></i>
                            </div>
                        ))
                    }

                </div>
            </div>
            {/*搜索结果*/}
            <Popup
                visible={searchVisible}
                afterClose={back}
                position='right'
                bodyStyle={{ width: '100vw' }}
            >
                <div className="top">
                    <NavBar onBack={() => setSearchVisible(false)}>搜索结果</NavBar>
                    <Divider />
                </div>
                <ArticleItem articles={searchList} loadMore={() => searchResult(input)} hasMore={hasMore}/>
            </Popup>
        </>
    )
}

export default Search;