import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {ISVGIcon} from 'Services/Models';
import {EResponseStatus} from 'Services/Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {IAccount} from '../Models/Account';
import {ESetMode} from '../../../Services/Enums';

/**
 * Модель состояния главной страницы.
 */
export interface IMainStore {
    /* observer values */
    /**
     * Прототип аккаунта. Применяется при добавлении или изменении аккаунта
     */
    accountPrototype: IAccount;

    /**
     * Список аккаунтов пользователя.
     */
    accounts: IAccount[];

    /**
     * Список доступных категорий.
     */
    categories: ICategory[];

    /**
     * Поисковая строка в списке аккаунтов.
     */
    search: string;

    /**
     * Выбранные аккаунты.
     */
    selectedAccounts: IAccount[];

    /* getters */
    /**
     * Геттер возвращающий отсортированный список аккаунтов.
     */
    sortedAccounts: IAccount[];

    /**
     * Геттер, возвращающий найденные аккаунты по поисковому запросу.
     */
    searchedAccounts: IAccount[];

    /**
     * Геттер, достающий поля к выбранной категории в протипе аккаунта.
     */
    protoCategoryFields: IFieldsCategory[];

    /*actions*/
    /**
     * Экшн, загружающий аккаунты из базы данных.
     */
    loadAccounts(): Promise<EEncryptionStatus>;

    /**
     * Экшн, загружающий дефолтные категории из БД.
     */
    loadCategories(): Promise<EResponseStatus>;

    /**
     * Экшн, добавляющий новый аккаунт в базу данных.
     */
    addAccount(): Generator<Promise<IEncryptionResponse<IAccount[]>>>;

    /**
     * Экшн, редактирующий аккаунт в БД.
     *
     * @param account Отредактированный аккаунт.
     */
    editAccount(account: IAccount): Promise<void>;

    /**
     * Экшн, устанавливающий значение в прототип аккаунта по указанному пути.
     *
     * @param path Путь до свойства.
     * @example 'obj.field.data.password'
     *
     * @param data Значение, которое необходимо записать по указанному пути.
     */
    setFieldAccountPrototype(path: string, data: unknown): void;

    /**
     * Экшн, устанавливающий состояние прототипа аккаунта из переданного параметра
     * (предварительно убирает наблюдателей).
     *
     * @param account Аккаунт, который необходимо скопировать в прототип аккаунта.
     */
    setAccountPrototype(account: IAccount): void;

    /**
     * Экшн сбрасывающий состояние прототипа аккаунта до дефолтного состояния.
     */
    resetAccountPrototype(): void;

    /*экшн в перегрузке*/
    /**
     * Экшн, управляющий состоянием выбранных аккаунтов.
     *
     * @param mode Стратегия поведения с selectedAccounts (add/delete/clear).
     * @param account аккаунт в списке с которым необходимо совершить действие.
     */
    setSelectedAccounts(mode: ESetMode.ADD, account: IAccount): void;
    setSelectedAccounts(mode: ESetMode.DELETE, account: IAccount): void;
    setSelectedAccounts(mode: ESetMode.CLEAR, account?: never): void;
    setSelectedAccounts(mode: any, account: any): any;
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
