import {IRoute} from 'Router/Models';

/**
 * Имена роутов модуля настроек.
 */
export const SETTINGS_ROUTE_NAMES = {
    ROOT: '/settings',
};

/**
 * Описание роутера модуля настроек.
 */
export const SETTINGS_ROUTE: IRoute = {
    path: SETTINGS_ROUTE_NAMES.ROOT,
    loadChildren: () =>
        import(
            /* webpackChunkName: "Settings" */
            /* webpackMode: "lazy" */
            '../Pages/Settings'
        ),
};
