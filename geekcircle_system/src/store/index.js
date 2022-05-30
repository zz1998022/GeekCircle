import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';


//创建redux数据
export default configureStore({
    reducer: {
        user:userSlice
    }
})