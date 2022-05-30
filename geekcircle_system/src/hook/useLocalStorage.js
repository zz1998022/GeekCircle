import { useState } from 'react';

export function useLocalStorage(key,initialValue){
    //声明状态
    const [storedValue,setStoredValue] = useState(function(){
        //查看本地是否已有状态值
        const item = window.localStorage.getItem(key);
        //如果本地存在 就使用本地存储 ，否则使用 initialValue
        return item ? JSON.parse(item) : initialValue;
    });
    //对状态方法进行增强
    const setState = (value) => {
        //获取新的状态值
        const valueToStore = value instanceof Function ? value(storedValue) :value;
        //设置状态
        setStoredValue(valueToStore);
        //将状态值同步到 localStorage
        localStorage.setItem(key,JSON.stringify(valueToStore));
    };
    //返回状态及设置状态的方法
    return [storedValue,setState];
}