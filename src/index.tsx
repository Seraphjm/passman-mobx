import React from 'react';
import ReactDOM from 'react-dom';
import 'Common/Styles/Common.scss';
import {createAppRouter} from 'Router/AppRouterCreator';
import {ROUTER_CONFIG} from 'Router/Routes';
import {RootStoreContext, stores} from 'Store';
import {IntlWrapper} from 'i18n';

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={stores}>
            <IntlWrapper>{createAppRouter(ROUTER_CONFIG)}</IntlWrapper>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
