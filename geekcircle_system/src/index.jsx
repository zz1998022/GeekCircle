import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <Router>
            <App />
          </Router>
      </Provider>
  </React.StrictMode>
);
