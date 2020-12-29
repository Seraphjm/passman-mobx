import {ESetMode} from 'Services/Enums';
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
     * Экшн, изменяющий сохранённые в базе аккаунты пользователя.
     * На вход принимается массив изменяемых/добавляемых аккаунтов, смотрится mode,
     * И в соответствии с ним выполняется необходимая стратегия по diff.
     *
     * @param accounts Аккаунты, которые необходимо изменить/добавить.
     * @param mode Применяемая стратегия по отношению к переданным аккаунтам add/put/delete.
     * @param password Пароль пользователя.
     */
    setAccounts(accounts: IAccount[], mode: ESetMode, password: string): Promise<IResponse<IAccount[]>>;

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
