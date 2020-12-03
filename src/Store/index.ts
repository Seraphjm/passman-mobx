import {configure} from 'mobx';
import {createContext} from 'react';
import {SettingsStore} from 'Modules/Settings/Store';
import {defaultSettings} from 'Modules/Settings/Store/Consts';
import {ISettingsStore} from 'Modules/Settings/Store/Models';
import {AuthStore} from 'Modules/Auth/Store';
import {defaultAuthorization} from 'Modules/Auth/Store/Consts';
import {IAuthorizationStore} from 'Modules/Auth/Store/Models';
import {IRootStoreModel, IStore, TRootStore} from './Models';

configure({
    enforceActions: 'always',
    disableErrorBoundaries: process.env.NODE_ENV !== 'development',
});

/**
 * Корневое состояние приложения.
 */
class RootStore implements IRootStoreModel {
    settingsStore: ISettingsStore;
    authStore: IAuthorizationStore;

    constructor() {
        this.settingsStore = new SettingsStore();
        this.authStore = new AuthStore();
    }
}

const observableRootStore: IRootStoreModel = new RootStore();

export const stores: IStore = {
    settings: observableRootStore.settingsStore,
    authorization: observableRootStore.authStore,
};

export const RootStoreContext = createContext<TRootStore>({
    settings: defaultSettings,
    authorization: defaultAuthorization,
});
