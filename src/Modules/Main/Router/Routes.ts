import {IRoute} from 'Router/Models';

export const MAIN_ROUTE_NAMES = {
    ROOT: '/main',
};

export const MAIN_ROUTE: IRoute = {
    path: MAIN_ROUTE_NAMES.ROOT,
    loadChildren: () =>
        import(
            /* webpackChunkName: "Main" */
            /* webpackMode: "lazy" */
            '../Pages/Main'
        ),
};
