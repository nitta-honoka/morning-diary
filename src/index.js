
import 'emoji-mart/css/emoji-mart.css'
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
