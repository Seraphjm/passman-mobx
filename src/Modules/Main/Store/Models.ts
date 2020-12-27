import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IAccount} from '../Models/Account';

/**
 * Модель состояния главной страницы.
 *
 * @prop accountPrototype Прототип аккаунта. Применяется при добавлении или изменении аккаунта.
 * @prop accounts Список аккаунтов пользователя.
 * @prop loadAccounts Экшн, загружающий аккаунты из базы данных.
 * @prop setAccounts Экшн, изменяющий состояние аккаунтов в базе данных.
 * @prop searchedAccounts Геттер изменяющий состояние аккаунтов в базе данных.
 */
export interface IMainStore {
    accountPrototype: IAccount;
    accounts: IAccount[];
    search: string;
    loadAccounts(): Promise<EEncryptionStatus>;
    setAccounts(a: any, b: any, c: any): any;
    setFieldAccountPrototype(path: string, data: any): void;
    resetAccountPrototype(): void;
    searchedAccounts: IAccount[];
}

/**
 * Модель дефолтного состояния главной страницы.
 *
 * @prop accounts Список аккаунтов пользователя.
 */
export interface IDefaultMainStore {
    accounts: IAccount[];
}
