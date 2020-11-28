import React from 'react';
import ReactDOM from 'react-dom';
import 'Common/Styles/Common.scss';
import {createAppRouter} from 'Router/AppRouterCreator';
import {ROUTER_CONFIG} from 'Router/Routes';

ReactDOM.render(
  <React.StrictMode>
      {createAppRouter(ROUTER_CONFIG)}
  </React.StrictMode>,
  document.getElementById('root')
);
