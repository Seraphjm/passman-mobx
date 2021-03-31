import {IDefaultMainStore} from './Models';
import {passwordGenerate, uuid} from 'Utils/Utils';
import {ENotificationPeriodUpdate} from '../Enums';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
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
    _id: uuid(),
    name: '',
    categoryId: '',
    subCategory: '',
    logotype: {
        icon: faKeycdn,
    },
    lastUpdate: new Date().toISOString(),
    passwordLastUpdate: new Date().toISOString(),
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
        secret_answer: '',
        secret_question: '',
    },
});

/**
 * Данные о порядке стандартных полей при сортировке.
 */
export const SORT_ORDER: {[key: string]: number} = {
    email: 0,
    login: 1,
    site: 3,
    phone: 4,
    comment: 5,
    secret_question: 6,
    secret_answer: 7,
};

/**
 * Основные поля аккаунта.
 */
export const DEFAULT_FIELDS: string[] = ['login', 'email', 'phone', 'site'];

/**
 * Дополнительные поля аккаунта.
 */
export const ADDITIONAL_FIELDS: string[] = ['secret_answer', 'secret_question', 'comment'];
