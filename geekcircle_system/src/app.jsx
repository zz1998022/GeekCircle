import './App.css';
import { Routes, Route , Navigate } from "react-router-dom"

import AppLayout from './components/AppLayout';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Article from "./pages/Article";
import Publish from "./pages/Publish";
import Error from "./pages/Error";
import AuthGuardOutlet from "./common/AuthGuardOutlet";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Navigate to='/home'/>} />
          <Route path="/home" element={<AuthGuardOutlet/>}>
              <Route path="" element={<AppLayout />}>
                  <Route path="" element={<Home />} />
                  <Route path="article" element={<Article />}/>
                  <Route path="publish/*" element={<Publish />}/>
              </Route>
          </Route>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<Error />} />
      </Routes>
  );
}

export default App;
