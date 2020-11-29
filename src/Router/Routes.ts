import {IRoute} from './Models';
import {AUTH_ROUTE, AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import {MAIN_ROUTE} from 'Modules/Main/Router/Routes';
import {SETTINGS_ROUTE} from 'Modules/Settings/Router/Routes';

/**
 * Список роутов приложения.
 */
export const ROUTER_CONFIG: IRoute[] = [
    {path: '/', redirect: AUTH_ROUTE_NAMES.ENTER_PASSWORD},
    {path: '*', redirect: AUTH_ROUTE_NAMES.ENTER_PASSWORD},
    AUTH_ROUTE,
    MAIN_ROUTE,
    SETTINGS_ROUTE,
];
