import {configure} from 'mobx';
import {SettingsStore} from 'Modules/Settings/Store';
import {createContext} from 'react';
import {defaultSettings} from 'Modules/Settings/Store/Consts';
import {ISettingsStore} from 'Modules/Settings/Store/Models';
import {IRootStoreModel, IStore, TRootStore} from './Models';

configure({
    enforceActions: 'always',
    disableErrorBoundaries: process.env.NODE_ENV !== 'development',
});

class RootStore implements IRootStoreModel {
    settingsStore: ISettingsStore;

    constructor() {
        this.settingsStore = new SettingsStore();
    }
}

const observableRootStore: IRootStoreModel = new RootStore();

export const stores: IStore = {
    settings: observableRootStore.settingsStore,
};

export const RootStoreContext = createContext<TRootStore>({
    settings: defaultSettings,
});
