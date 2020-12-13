import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IAccount} from '../Models/Account';

/**
 * Модель состояния главной страницы.
 *
 * @prop accounts Список аккаунтов пользователя.
 * @prop loadAccounts Экшн, загружающий аккаунты из базы данных.
 * @prop setAccounts Экшн, изменяющий состояние аккаунтов в базе данных.
 */
export interface IMainStore {
    accounts: IAccount[];
    loadAccounts(): Promise<EEncryptionStatus>;
    setAccounts(a: any, b: any, c: any): any;
}

/**
 * Модель дефолтного состояния главной страницы.
 *
 * @prop accounts Список аккаунтов пользователя.
 */
export interface IDefaultMainStore {
    accounts: IAccount[];
}
