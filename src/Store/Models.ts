import {IDefaultSettingsStore, ISettingsStore} from 'Modules/Settings/Store/Models';
import {IAuthorizationStore, IDefaultAuthorizationStore} from 'Modules/Auth/Store/Models';
import {IDefaultMainStore, IMainStore} from 'Modules/Main/Store/Models';

/**
 * Модель состояния приложения.
 *
 * @prop settings Настройки.
 * @prop authorization Авторизация.
 * @prop main Главная страница.
 */
export interface IStore {
    settings: ISettingsStore;
    authorization: IAuthorizationStore;
    main: IMainStore;
}

/**
 * Модель дефолтного состояния приложения.
 *
 * @prop settings Настройки.
 * @prop authorization Авторизация.
 * @prop main Главная страница.
 */
export interface IDefaultStore {
    settings: IDefaultSettingsStore;
    authorization: IDefaultAuthorizationStore;
    main: IDefaultMainStore;
}

/**
 * Корневая модель состояния приложения.
 *
 * @prop settingsStore Хранилище настроек.
 * @prop authStore Хранилище авторизации.
 * @prop mainStore Хранилище главная страницы.
 */
export interface IRootStore {
    settingsStore: ISettingsStore;
    authStore: IAuthorizationStore;
    mainStore: IMainStore;
}

/**
 * Тип, объединяющий в себе дефолтное и рабочее состояние приложения.
 */
export type TRootStore = IStore | IDefaultStore;
