import {IResponse} from 'Services/Models';
import {IDBServiceLayer} from 'Services/Models';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {IAccount} from '../Models/Account';
import {ICategory} from '../Store/Models';
import {IRootStore} from 'Store/Models';

/**
 * Интерфейс сервисного слоя главной страницы.
 */
export interface IMainService {
    /**
     * Экземпляр корневого store.
     */
    rootStore: IRootStore;
    /**
     * Сервисный слой приложения.
     */
    serviceLayer: IDBServiceLayer;

    /**
     * Экшн, возвращающий сохранённые в базе аккаунты.
     */
    getAccounts(): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, добавляющий новый аккаунт в базу аккаунтов пользователя.
     *
     * @param account Аккаунты, которые необходимо изменить/добавить.
     */
    addAccount(account: IAccount): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, изменяющий сохранённые в базе аккаунты пользователя.
     *
     * @param account Аккаунты, которые необходимо изменить/добавить.
     */
    editAccount(account: IAccount): Promise<IEncryptionResponse<IAccount>>;

    /**
     * Экшн, удаляющий аккаунты пользователя из базы данных.
     *
     * @param accounts Аккаунты, которые необходимо изменить/добавить.
     */
    removeAccounts(accounts: IAccount[]): Promise<IEncryptionResponse<IAccount[]>>;

    /**
     * Экшн, возвращающий дефолтные категории.
     */
    getCategories(): Promise<IResponse<ICategory[]>>;

    /**
     * TODO: in progress
     */
    getUserCategories(): any[];

    /**
     * TODO: in progress
     */
    setUserCategories(categories: any[]): any;
}
