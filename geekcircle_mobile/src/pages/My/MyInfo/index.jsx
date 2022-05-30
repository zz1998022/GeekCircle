import {NavBar , List , Popup ,DatePicker , TextArea , Input , Toast , Modal} from "antd-mobile";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import './MyInfo.css';
import service from "../../../request/axios";
import dayjs from "dayjs";

function MyInfo(){
    const navigate = useNavigate();

    //图片项弹出层
    const [imgVisible, setImgVisible] = useState(false)
    //姓名项弹出层
    const [nameVisible,setNameVisible] = useState(false);
    //简介项弹出层
    const [introVisible,setIntroVisible] = useState(false);
    //性别项弹出层
    const [sexVisible,setSexVisible] = useState(false);
    //生日项弹出层
    const [birthdayVisible,setBirthdayVisible] = useState(false);
    //退出登录弹出层
    const [logoutVisible,setLogoutVisible] = useState(false);

    //本地token获取
    const token = localStorage.getItem('mobile_token');

    //用户个人资料
    const [profile , setProfile] = useState({});

    //上传文件的ref对象
    const fileRef = useRef(null);


    //获取用户信息
    useEffect(() => {
        if(token === null){
            navigate('/login');
        }
        getMyProfile();
    },[token])

    //获取用户个人资料
    const getMyProfile = () => {
        service.get('user/profile').then((result) => {
            setProfile(result);
        });
    }

    //图片上传
    const onChangePhoto = (e) => {
        const formData = new FormData();
        formData.append('photo',e.target.files[0])
        //发送请求
        service({
            url: '/user/photo',
            method: 'PATCH',
            data: formData
        }).then(() => {
            Toast.show({
                icon: 'success',
                content: '上传成功',
            })
            setImgVisible(false);
            getMyProfile();
        })
    }

    //更新用户信息
    const changeInfo = () => {
        service.patch('/user/profile',profile).then(() => {
            Toast.show({
                icon: 'success',
                content: '更新成功',
            })
        })
        //取消弹框
        setNameVisible(false);
        setIntroVisible(false);
        setSexVisible(false);
        setBirthdayVisible(false);
    }

    //退出登录
    const logout = () => {
        localStorage.removeItem('mobile_token');
        localStorage.removeItem('mobile_refresh_token');
        navigate(-1);
    }

   return (
       <>
           {/*标题*/}
           <div className="top">
               <NavBar onBack={() => navigate(-1)}>个人信息</NavBar>
           </div>

           {/*列表一*/}
           <List>
               <List.Item extra={<img src={profile.photo} className="list_img"/>} onClick={() => setImgVisible(true)} clickable>
                   头像
                   <Popup
                       visible={imgVisible}
                       onMaskClick={() => {
                           setImgVisible(false)
                       }}
                       bodyStyle={{ height: '20vh' }}
                   >
                       <List>
                           <List.Item>
                               <div className="file_input" style={{paddingLeft: 9.6 + 'rem',paddingRight: 9.6 + 'rem'}}>
                                   拍照
                                   <input type="file" ref={fileRef} onChange={onChangePhoto}/>
                               </div>
                           </List.Item>
                           <List.Item>
                               <div className="file_input">
                                   本地选择
                                   <input type="file" ref={fileRef} onChange={onChangePhoto}/>
                               </div>
                           </List.Item>
                       </List>
                   </Popup>
               </List.Item>
               <List.Item extra={profile.name} onClick={() => setNameVisible(true)} clickable>
                   昵称
                   <Popup
                       visible={nameVisible}
                       onMaskClick={() => {
                           setNameVisible(false)
                       }}
                       position='right'
                       bodyStyle={{ width: '100vw' }}
                   >
                       <div className="top">
                           <NavBar
                               onBack={() => setNameVisible(false)}
                               right={(<span className="submit_button"
                               onClick={() => changeInfo()}>提交</span>)}>
                               编辑名称
                           </NavBar>
                       </div>
                       <Input
                           placeholder='请输入内容'
                           value={profile.name}
                           onChange = {(name) => {
                               setProfile({...profile,name});
                           }}
                           className="name_input"
                       />
                   </Popup>
               </List.Item>
               <List.Item extra={profile.intro ? profile.intro : '未填写'}
                          onClick={() => setIntroVisible(true)} clickable>
                   简介
                   <Popup
                       visible={introVisible}
                       onMaskClick={() => {
                           setIntroVisible(false)
                       }}
                       position='right'
                       bodyStyle={{ width: '100vw' }}
                   >
                       <div className="top">
                           <NavBar onBack={() => setIntroVisible(false)}
                                   right={(<span className="submit_button"
                                   onClick={() => changeInfo()}>提交</span>)}>编辑简介</NavBar>
                       </div>
                       <TextArea
                           style={{
                               backgroundColor: '#f7f8fa',
                               borderRadius: 0.7+'rem',
                           }}
                           value={profile.intro ? profile.intro: ''}
                           onChange={(intro) => {
                               setProfile({...profile,intro})
                           }}
                           showCount
                           maxLength={100}
                           placeholder={"请输入简介"}
                       />
                   </Popup>
               </List.Item>
           </List>
           {/*列表二*/}
           <List className="list">
               <List.Item extra={profile.gender === 0 ? '男' : '女'} onClick={() => setSexVisible(true)} clickable>
                   性别
                   <Popup
                       visible={sexVisible}
                       onMaskClick={() => {
                           setSexVisible(false)
                       }}
                       bodyStyle={{ height: '18vh' }}
                   >
                       <List>
                           <List.Item><div className="popup_item" onClick={() => {
                               setProfile({...profile,gender:0})
                               changeInfo()
                           }}>男</div></List.Item>
                           <List.Item><div className="popup_item" onClick={() => {
                               setProfile({...profile,gender:1})
                               changeInfo()
                           }}>女</div></List.Item>
                       </List>
                   </Popup>
               </List.Item>
               <List.Item extra={profile.birthday} onClick={() => setBirthdayVisible(true)} clickable>
                   生日
                   <Popup
                       visible={birthdayVisible}
                       onMaskClick={() => {
                           setBirthdayVisible(false)
                       }}
                       bodyStyle={{ height: '18vh' }}
                   >
                       <DatePicker
                           visible={birthdayVisible}
                           onClose={() => {
                               setBirthdayVisible(false)
                           }}
                           min={new Date("1980-10-10")}
                           value={new Date(profile.birthday)}
                           onConfirm={date => {
                               const day = dayjs(date).format('YYYY-MM-DD');
                               setProfile({...profile,birthday:day});
                               changeInfo();
                           }}
                       >
                       </DatePicker>
                   </Popup>
               </List.Item>
           </List>

           {/*退出登录*/}
           <div className="login_out" onClick={() => setLogoutVisible(true)}>
               <span>退出登录</span>
           </div>
           <Modal
               visible={logoutVisible}
               title='温馨提示'
               content='亲，您确定要退出吗？'
               closeOnAction
               onClose={() => {
                   setLogoutVisible(false)
               }}
               actions={[
                   {
                       key: 'confirm',
                       text: '确认',
                       danger: true,
                       onClick: logout
                   },
                   {
                       key: 'cancel',
                       text: '取消',
                   }
               ]}
           />
       </>
   )
}

export default MyInfo;