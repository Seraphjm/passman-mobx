import {IRoute} from './Models';
import {AUTH_ROUTE, AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';

/**
 * Список роутов приложения.
 */
export const ROUTER_CONFIG: IRoute[] = [{path: '/', redirect: AUTH_ROUTE_NAMES.ENTER_PASSWORD}, AUTH_ROUTE];
