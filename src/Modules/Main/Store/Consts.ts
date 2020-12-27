import {IDefaultMainStore} from './Models';
import {passwordGenerate} from 'Utils/Utils';
import {ENotificationPeriodUpdate} from '../Enums';
import {IAccount} from '../Models/Account';

/**
 * Дефолтное состояние страницы авторизации.
 */
export const defaultMain: IDefaultMainStore = {
    accounts: [],
};

export const getDefaultAccountPrototype = (): IAccount => ({
    _id: '',
    accountName: '',
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
        site: '',
        phone: '',
        password: passwordGenerate(),
        email: '',
        comment: '',
        login: '',
    },
});
