import {IDefaultSettingsStore, ISettingsStore} from 'Modules/Settings/Store/Models';
import {IAuthorizationStore, IDefaultAuthorizationStore} from 'Modules/Auth/Store/Models';

/**
 * Модель состояния приложения.
 *
 * settings Настройки.
 */
export interface IStore {
    settings: ISettingsStore;
    authorization: IAuthorizationStore;
}

/**
 * Модель дефолтного состояния приложения.
 *
 * settings Настройки.
 */
export interface IDefaultStore {
    settings: IDefaultSettingsStore;
    authorization: IDefaultAuthorizationStore;
}

/**
 * Корневая модель состояния приложения.
 *
 * settingsStore Настройки.
 */
export interface IRootStoreModel {
    settingsStore: ISettingsStore;
    authStore: IAuthorizationStore;
}

/**
 * Тип, объединяющий в себе дефолтное и рабочее состояние приложения.
 */
export type TRootStore = IStore | IDefaultStore;
