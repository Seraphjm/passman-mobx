import {IRoute} from '../../../Router/Models';
import {Authorization} from '../Pages/Authorization';
import {AuthorizationForm} from '../Components/AuthorizationForm';

export const AUTH_ROUTE_NAMES = {
    AUTH: '/auth',
    ENTER_PASSWORD: '/auth/enter-password',
    CHANGE_PASSWORD: '/auth/change-password'
};

export const AUTH_ROUTE: IRoute = {
    path: AUTH_ROUTE_NAMES.AUTH,
    component: Authorization,
    routes: [
        {
            path: AUTH_ROUTE_NAMES.ENTER_PASSWORD,
            component: AuthorizationForm
        },
        {
            path: AUTH_ROUTE_NAMES.CHANGE_PASSWORD,
            loadChildren: () => import(
                /* webpackChunkName: "ChangeMasterKey" */
                /* webpackMode: "lazy" */
                '../Components/ChangeMasterKey'
                ),
        },
    ]
};
