import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {ISVGIcon} from 'Services/Models';
import {EResponseStatus, ESetMode} from 'Services/Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {IAccount} from '../Models/Account';

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
     * Выбранная подкатегория. Дополнительный фильтр под выбранной категорией.
     */
    selectedSubcategory: string;

    /**
     * Активная категория.
     */
    selectedCategory: string;

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

    /* getters */
    /**
     * Геттер содержащий список аккаунтов относящихся к активной категории.
     */
    currentCategoryAccounts: IAccount[];

    /**
     * Геттер, возвращающий найденные аккаунты по поисковому запросу.
     */
    searchedAccounts: IAccount[];

    /**
     * Геттер, возвращающий найденные аккаунты по поисковому запросу.
     */
    showedAccounts: IAccount[];

    /**
     * Геттер, достающий поля к выбранной категории в протипе аккаунта.
     */
    protoCategoryFields: IFieldsCategory[];

    /**
     * Геттер, достающий поля к выбранной категории в протипе аккаунта.
     */
    activeCategory: string;

    /**
     * Геттер, достающий поля к выбранной категории в протипе аккаунта.
     */
    enabledCategories: ICategory[];

    /**
     * Геттер, содержащий список всех уникальных подкатегорий во всех аккаунтах.
     */
    subcategories: string[];

    /**
     * Геттер, содержащий список всех уникальных подкатегорий по аккаунтам, находящимся в активной категории.
     */
    currentSubcategoryList: string[];

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
     * Экшн, устанавливающий активную категорию в сайдбаре.
     */
    setSelectedCategory(id: string): void;

    /**
     * Экшн, устанавливающий активную подкатегорию в сайдбаре.
     */
    setSelectedSubcategory(subcategory: string): void;

    /**
     * Экшн, устанавливающий активную категорию в сайдбаре.
     */
    setSearch(search: string): void;

    /**
     * Экшн, добавляющий новый аккаунт в базу данных.
     */
    addAccount(): Generator<Promise<IEncryptionResponse<IAccount[]>>>;

    /**
     * Экшн, удаляющий аккаунты из базы данных.
     */
    removeAccounts(accounts: IAccount[]): Generator<Promise<IEncryptionResponse<IAccount[]>>>;

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
 * @prop id Идентификатор категории.
 * @prop name Имя категории.
 * @prop icon Иконка категории.
 * @prop fields Список полей соответствующих категории.
 */
export interface ICategory {
    id: string;
    name: string;
    icon: ISVGIcon;
    fields: IFieldsCategory[];
}
