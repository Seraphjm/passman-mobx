import {makeAutoObservable, runInAction} from 'mobx';
import {IDBServiceLayer} from 'Services/Models';
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
    *storeInit() {
        this.dbIsEmpty = yield this.serviceLayer.dbIsEmpty();
    }

    /**
     * @inheritDoc
     */
    logIn = () => {
        this.isChecking = true;
        this.rootStore.mainStore
            .loadAccounts()
            .then((status: EEncryptionStatus) => {
                runInAction(() => {
                    this.isChecking = false;
                });

                if (status === EEncryptionStatus.SUCCESS) {
                    redirectTo(MAIN_ROUTE_NAMES.ROOT);
                }
            })
            .catch((err) => {
                console.error(err);

                runInAction(() => {
                    this.isChecking = false;
                });
            });
    };

    /**
     * @inheritDoc
     */
    *createDB() {
        yield this.serviceLayer.createDB(this.password);
        this.dbIsEmpty = false;
    }

    /**
     * @inheritDoc
     */
    setPassword = (password: string): void => {
        // TODO тут следовало бы сразу importKey хранить, а не прокидывать пароль в открытом виде по всему data flow.
        this.password = password;
    };

    /**
     * @inheritDoc
     */
    changeMasterPassword = (newPassword: string) => {
        console.warn({newPassword});
    };
}
