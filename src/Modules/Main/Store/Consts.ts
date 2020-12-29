import {IDefaultMainStore} from './Models';
import {getRandomHex, passwordGenerate} from 'Utils/Utils';
import {ENotificationPeriodUpdate} from '../Enums';
import {IAccount} from '../Models/Account';

/**
 * Дефолтное состояние страницы авторизации.
 */
export const defaultMain: IDefaultMainStore = {
    accounts: [],
};

/**
 * Функция возвращающая дефолтное состояние прототипа аккаунта.
 * Функция? - необходимо для запуска функции генерации пароля.
 */
export const getDefaultAccountPrototype = (): IAccount => ({
    _id: getRandomHex(),
    category: '',
    subCategory: '',
    logotype: {
        color: '#000000',
        logo: '',
    },
    lastUpdate: new Date(),
    passwordLastUpdate: new Date(),
    settings: {
        badges: [],
        notifications: {
            passwordNeedUpdate: {
                enabled: true,
                default: ENotificationPeriodUpdate.SIX_MOUTH,
            },
        },
    },
    data: {
        name: '',
        site: '',
        phone: '',
        password: passwordGenerate(),
        email: '',
        comment: '',
        login: '',
    },
});
