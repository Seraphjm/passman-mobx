import {configure} from 'mobx';
import {createContext} from 'react';
import {SettingsStore} from 'Modules/Settings/Store';
import {defaultSettings} from 'Modules/Settings/Store/Consts';
import {ISettingsStore} from 'Modules/Settings/Store/Models';
import {AuthStore} from 'Modules/Auth/Store';
import {defaultAuthorization} from 'Modules/Auth/Store/Consts';
import {IAuthorizationStore} from 'Modules/Auth/Store/Models';
import {IRootStore, IStore, TRootStore} from './Models';
import {ServiceLayer} from 'Services';
import {IMainStore} from 'Modules/Main/Store/Models';
import {MainStore} from 'Modules/Main/Store';
import {MainService} from 'Modules/Main/Services';
import {defaultMain} from 'Modules/Main/Store/Consts';

/**
 * Конфигурация mobx в режиме development.
 */
configure({
    enforceActions: 'always',
    disableErrorBoundaries: process.env.NODE_ENV !== 'development',
});

/**
 * Корневое состояние приложения.
 */
class RootStore implements IRootStore {
    /**
     * @inheritDoc
     */
    settingsStore: ISettingsStore;
    /**
     * @inheritDoc
     */
    authStore: IAuthorizationStore;
    /**
     * @inheritDoc
     */
    mainStore: IMainStore;

    constructor() {
        this.settingsStore = new SettingsStore();
        this.authStore = new AuthStore(this, ServiceLayer);
        this.mainStore = new MainStore(this, new MainService(ServiceLayer));
    }
}

/**
 * Наблюдаемый объект корневого хранилища
 */
const observableRootStore: IRootStore = new RootStore();

/**
 * Наблюдаемый объект хранилищ, содержащихся в root store. Передаётся в reactContext.
 */
export const stores: IStore = {
    settings: observableRootStore.settingsStore,
    authorization: observableRootStore.authStore,
    main: observableRootStore.mainStore,
};

/**
 * Создание контекста наблюдаеомго mobx хранилища.
 */
export const RootStoreContext = createContext<TRootStore>({
    settings: defaultSettings,
    authorization: defaultAuthorization,
    main: defaultMain,
});
