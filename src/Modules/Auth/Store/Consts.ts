import {IDefaultAuthorizationStore} from './Models';

/**
 * Дефолтное состояние страницы авторизации.
 */
export const defaultAuthorization: IDefaultAuthorizationStore = {
    secretKey: '',
    isLogin: null,
    isChecking: false,
    dbIsEmpty: false,
};
