import {IDefaultSettingsStore, ISettingsStore} from 'Modules/Settings/Store/Models';

export interface IStore {
    settings: ISettingsStore;
}

export interface IDefaultStore {
    settings: IDefaultSettingsStore;
}

export interface IRootStoreModel {
    settingsStore: ISettingsStore;
}

export type TRootStore = IStore | IDefaultStore;
