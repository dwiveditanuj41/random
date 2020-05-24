import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import '@indshine/ui-kit/dist/semantic.min.css';
import '@indshine/platform-canvas/build/static/css/index.css';

import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env === 'development') {
  serviceWorker.unregister();
} else if (process.env === 'production') {
  serviceWorker.register();
}
