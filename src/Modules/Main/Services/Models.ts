import {IResponse} from 'Services/Models';
import {IDBServiceLayer} from 'Services/Models';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {IAccount} from '../Models/Account';
import {ICategory} from '../Store/Models';

/**
 * Интерфейс сервисного слоя главной страницы.
 */
export interface IMainService {
    /**
     * Сервисный слой приложения.
     */
    serviceLayer: IDBServiceLayer;

    /**
     * Экшн, возвращающий сохранённые в базе аккаунты.
     *
     * @param password Пароль пользователя.
     */
    getAccounts(password: string): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, добавляющий новый аккаунт в базу аккаунтов пользователя.
     *
     * @param account Аккаунты, которые необходимо изменить/добавить.
     * @param password Пароль пользователя.
     */
    addAccount(account: IAccount, password: string): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, изменяющий сохранённые в базе аккаунты пользователя.
     *
     * @param account Аккаунты, которые необходимо изменить/добавить.
     * @param password Пароль пользователя.
     */
    editAccount(account: IAccount, password: string): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, изменяющий сохранённые в базе аккаунты пользователя.
     *
     * @param accounts Аккаунты, которые необходимо изменить/добавить.
     * @param password Пароль пользователя.
     */
    removeAccounts(accounts: IAccount[], password: string): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, возвращающий дефолтные категории.
     */
    getCategories(): Promise<IResponse<ICategory[]>>;

    /**
     * TODO: in progress
     */
    getUserCategories(password: string): any[];

    /**
     * TODO: in progress
     */
    setUserCategories(categories: any[], password: string): any;
}
