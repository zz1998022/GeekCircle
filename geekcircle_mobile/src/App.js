import './App.css';
import {
  Routes,
  Route,
  MemoryRouter as Router,
} from 'react-router-dom';

import React from 'react';
import Home from './pages/Home';
import My from './pages/My';
import QA from './pages/QA';
import Video from './pages/Video';
import Login from './pages/Login';
import MyInfo from './pages/My/MyInfo';
import MyCollections from './pages/My/MyCollections';
import Chat from './pages/My/Chat';
import Search from './pages/Search';
import Article from './pages/Article';

function App() {
  return (
    <Router initialEntries={['/home']}>
      <div className="app">
        <div className="body">
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/qa" element={<QA />} />
            <Route exact path="/video" element={<Video />} />
            <Route exact path="/my" element={<My />} />
            <Route exact path="/login" element={<Login />} />
            <Route path="/myInfo" element={<MyInfo />} />
            <Route path="/myCollections" element={<MyCollections />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} />
            <Route path="/article/:id" element={<Article />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
