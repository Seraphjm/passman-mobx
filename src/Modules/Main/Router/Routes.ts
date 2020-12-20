import {IRoute} from 'Router/Models';

/**
 * Имена роутов модуля главной страницы.
 */
export const MAIN_ROUTE_NAMES = {
    ROOT: '/main',
};

/**
 * Описание роутера модуля главной страницы.
 */
export const MAIN_ROUTE: IRoute = {
    path: MAIN_ROUTE_NAMES.ROOT,
    loadChildren: () =>
        import(
            /* webpackChunkName: "Main" */
            /* webpackMode: "lazy" */
            '../Pages/Main'
        ),
};
