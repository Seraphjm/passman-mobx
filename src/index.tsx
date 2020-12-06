import React from 'react';
import ReactDOM from 'react-dom';
import {createAppRouter} from 'Router/AppRouterCreator';
import {ROUTER_CONFIG} from 'Router/Routes';
import {RootStoreContext, stores} from 'Store';
import {IntlWrapper} from 'i18n';
import 'Common/Styles/Common.scss';
// TODO.CRITICAL: [разделение ui]
// TODO.CRITICAL: утащить в соответствующий провайдер при вынесении ui части в отдельный пакет.
import 'ui/Styles/common.style.scss';

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={stores}>
            <IntlWrapper>{createAppRouter(ROUTER_CONFIG)}</IntlWrapper>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
