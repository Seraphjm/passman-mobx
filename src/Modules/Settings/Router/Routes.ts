import {IRoute} from 'Router/Models';

export const SETTINGS_ROUTE_NAMES = {
    ROOT: '/settings',
};

export const SETTINGS_ROUTE: IRoute = {
    path: SETTINGS_ROUTE_NAMES.ROOT,
    loadChildren: () =>
        import(
            /* webpackChunkName: "Settings" */
            /* webpackMode: "lazy" */
            '../Pages/Settings'
        ),
};
