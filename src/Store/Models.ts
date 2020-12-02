import {IDefaultSettingsStore, ISettingsStore} from 'Modules/Settings/Store/Models';

/**
 * Модель состояния приложения.
 *
 * settings Настройки.
 */
export interface IStore {
    settings: ISettingsStore;
}

/**
 * Модель дефолтного состояния приложения.
 *
 * settings Настройки.
 */
export interface IDefaultStore {
    settings: IDefaultSettingsStore;
}

/**
 * Корневая модель состояния приложения.
 *
 * settingsStore Настройки.
 */
export interface IRootStoreModel {
    settingsStore: ISettingsStore;
}

/**
 * Тип, объединяющий в себе дефолтное и рабочее состояние приложения.
 */
export type TRootStore = IStore | IDefaultStore;
