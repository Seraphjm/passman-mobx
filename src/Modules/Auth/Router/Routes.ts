import {IRoute} from 'Router/Models';
import {Authorization} from '../Components/Authorization';
import {AuthorizationPage} from '../Pages/Authorization';

/**
 * Имена роутов модуля авторизации.
 */
export const AUTH_ROUTE_NAMES = {
    ROOT: '/auth',
    ENTER_PASSWORD: '/auth/enter-password',
    CHANGE_PASSWORD: '/auth/change-password',
};

/**
 * Описание роутера модуля авторизации.
 */
export const AUTH_ROUTE: IRoute = {
    path: AUTH_ROUTE_NAMES.ROOT,
    redirect: AUTH_ROUTE_NAMES.ENTER_PASSWORD,
    component: AuthorizationPage,
    routes: [
        {
            path: AUTH_ROUTE_NAMES.ENTER_PASSWORD,
            component: Authorization,
        },
        {
            path: AUTH_ROUTE_NAMES.CHANGE_PASSWORD,
            loadChildren: () =>
                import(
                    /* webpackChunkName: "ChangeMasterKey" */
                    /* webpackMode: "lazy" */
                    '../Components/ChangeMasterKey'
                ),
        },
    ],
};
