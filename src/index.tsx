import React from 'react';
import ReactDOM from 'react-dom';
import {createAppRouter} from 'Router/AppRouterCreator';
import {ROUTER_CONFIG} from 'Router/Routes';
import {RootStoreContext, stores} from 'Store';
import {IntlWrapper} from 'i18n';
import 'Common/Styles/Common.scss';
import {UiProvider} from './ui/UiProvider';
// TODO: [разделение ui]
// TODO: утащить в соответствующий провайдер при вынесении ui части в отдельный пакет.

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={stores}>
            <IntlWrapper>
                <UiProvider>{createAppRouter(ROUTER_CONFIG)}</UiProvider>
            </IntlWrapper>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
