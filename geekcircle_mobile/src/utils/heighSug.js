export const heighSug = (text,word) => {
    //转小写
    const lowerText = text.toLowerCase();
    const lowerWord = word.toLowerCase();
    //找到搜索内容在联想结果位置
    const index = lowerText.indexOf(lowerWord);
    //获取搜索内容左侧
    const left = lowerText.slice(0,index);
    //获取搜索内容右侧
    const right = lowerText.slice(index+word.length);
    const search = lowerText.slice(index,index+word.length);
    return (
        <p>
            {left}
            <span style={{color:'red'}}>{search}</span>
            {right}
        </p>
    );
}