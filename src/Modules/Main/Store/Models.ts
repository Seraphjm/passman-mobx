import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {ISVGIcon} from 'Services/Models';
import {EResponseStatus} from 'Services/Enums';
import {IResponse} from 'Services/Models';
import {IAccount} from '../Models/Account';

/**
 * Модель состояния главной страницы.
 *
 * @prop accountPrototype Прототип аккаунта. Применяется при добавлении или изменении аккаунта.
 * @prop accounts Список аккаунтов пользователя.
 * @prop categories Список доступных категорий.
 * @prop loadAccounts Экшн, загружающий аккаунты из базы данных.
 * @prop loadCategories Экшн, загружающий дефолтные категории из БД.
 * @prop addAccount Экшн, добавляющий новый аккаунт в базу данных.
 * @prop searchedAccounts Геттер изменяющий состояние аккаунтов в базе данных.
 */
export interface IMainStore {
    accountPrototype: IAccount;
    accounts: IAccount[];
    categories: ICategory[];
    search: string;
    loadAccounts(): Promise<EEncryptionStatus>;
    loadCategories(): Promise<EResponseStatus>;
    addAccount(): Generator<Promise<IResponse<IAccount[]>>>;
    setFieldAccountPrototype(path: string, data: any): void;
    resetAccountPrototype(): void;
    searchedAccounts: IAccount[];
    protoCategoryFields: IFieldsCategory[];
}

/**
 * Модель дефолтного состояния главной страницы.
 *
 * @prop accounts Список аккаунтов пользователя.
 */
export interface IDefaultMainStore {
    accounts: IAccount[];
}

/**
 * Модель поля из списка полей текущей категории.
 *
 * @prop name Имя поля.
 * @prop placeholder placeholder поля.
 * @prop [required] Флаг обязательности заполнения поля.
 */
export interface IFieldsCategory {
    name: string;
    placeholder: string;
    required?: boolean;
}

/**
 * Модель категории.
 *
 * @prop name Имя категории.
 * @prop icon Иконка категории.
 * @prop fields Список полей соответствующих категории.
 */
export interface ICategory {
    name: string;
    icon: ISVGIcon;
    fields: IFieldsCategory[];
}
