import {makeAutoObservable, runInAction} from 'mobx';
import {EResponseStatus} from 'Services/Enums';
import {IDBServiceLayer, IResponse} from 'Services/Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {redirectTo} from 'Router/Utils';
import {MAIN_ROUTE_NAMES} from 'Modules/Main/Router/Routes';
import {IAuthorizationStore} from './Models';

/**
 * Описание роутера модуля главной страницы.
 */
export class AuthStore implements IAuthorizationStore {
    /**
     * @inheritDoc
     */
    password: string = '';
    /**
     * @inheritDoc
     */
    isChecking: boolean = false;
    /**
     * @inheritDoc
     */
    dbIsEmpty: boolean = false;
    /**
     * @inheritDoc
     */
    serviceLayer: IDBServiceLayer;
    /**
     * @inheritDoc
     */
    rootStore: IRootStore;

    constructor(rootStore: IRootStore, serviceLayer: IDBServiceLayer) {
        this.serviceLayer = serviceLayer;
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            serviceLayer: false,
            rootStore: false,
        });

        this.storeInit();

        this.createDB = this.createDB.bind(this);
    }

    /**
     * @inheritDoc
     */
    *storeInit(): Generator<Promise<boolean>> | boolean {
        this.dbIsEmpty = yield this.serviceLayer.dbIsEmpty();
    }

    /**
     * @inheritDoc
     */
    logIn = (): Promise<void> => {
        this.isChecking = true;
        return Promise.all([this.rootStore.mainStore.loadAccounts(), this.rootStore.mainStore.loadCategories()])
            .then(([loadAccountsStatus, loadCategoriesStatus]) => {
                runInAction(() => {
                    this.isChecking = false;
                });

                if (loadAccountsStatus === EEncryptionStatus.SUCCESS && loadCategoriesStatus === EResponseStatus.SUCCESS) {
                    redirectTo(MAIN_ROUTE_NAMES.ROOT); // todo.NOTIFICATION
                } else throw new Error(); // todo.NOTIFICATION
            })
            .catch(() => {
                runInAction(() => {
                    this.isChecking = false;
                });

                throw Error('auth error'); // todo.NOTIFICATION
            });
    };

    /**
     * @inheritDoc
     */
    *createDB(): Generator<Promise<IResponse>> {
        this.isChecking = true;
        yield this.serviceLayer.createDB(this.password);
        this.dbIsEmpty = false;
        this.isChecking = false;
    }

    /**
     * @inheritDoc
     */
    setPassword = (password: string): void => {
        // TODO.REFACTOR тут следовало бы сразу importKey хранить, а не прокидывать пароль в открытом виде по всему data
        // flow.
        this.password = password;
    };

    /**
     * @inheritDoc
     */
    changeMasterPassword = (newPassword: string) => {
        console.warn({newPassword});
    };
}
