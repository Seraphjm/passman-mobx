import {makeAutoObservable, runInAction} from 'mobx';
import {ICategory, IMainStore} from './Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {EResponseStatus, ESetMode} from 'Services/Enums';
import {set} from 'Utils/Utils';
import {IMainService} from '../Services/Models';
import {IAccount} from '../Models/Account';
import {getDefaultAccountPrototype} from './Consts';

/**
 * Стор главной страницы приложеия.
 */
export class MainStore implements IMainStore {
    /**
     * @inheritDoc
     */
    rootStore: IRootStore;
    /**
     * @inheritDoc
     */
    accountPrototype: IAccount = getDefaultAccountPrototype();
    /**
     * @inheritDoc
     */
    accounts: IAccount[] = [];
    /**
     * @inheritDoc
     */
    serviceLayer: IMainService;
    /**
     * @inheritDoc
     */
    categories: ICategory[] = [];
    /**
     * @inheritDoc
     */
    search: string = '';

    constructor(rootStore: IRootStore, serviceLayer: IMainService) {
        this.serviceLayer = serviceLayer;
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            serviceLayer: false,
            rootStore: false,
        });

        this.addAccount = this.addAccount.bind(this);
    }

    /**
     * @inheritDoc
     */
    get sortedAccounts() {
        return this.accounts.slice().sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    /**
     * @inheritDoc
     */
    get searchedAccounts() {
        return this.search ? [] : this.sortedAccounts;
    }

    /**
     * @inheritDoc
     */
    get protoCategoryFields() {
        return this.categories.find((category) => category.name === this.accountPrototype.category)?.fields || [];
    }

    /**
     * @inheritDoc
     */
    setFieldAccountPrototype = <T = unknown>(path: string, data: T) => {
        set<IAccount>(this.accountPrototype, path, data);
    };

    /**
     * @inheritDoc
     */
    resetAccountPrototype = () => {
        this.accountPrototype = getDefaultAccountPrototype();
    };

    /**
     * @inheritDoc
     */
    loadAccounts = (): Promise<EEncryptionStatus> =>
        this.serviceLayer.getAccounts(this.rootStore.authStore.password).then((response) => {
            if (response.status === EEncryptionStatus.SUCCESS) {
                runInAction(() => {
                    this.accounts = response.data || [];
                    // todo.NOTIFICATION
                });
            }

            return response.status;
        });

    /**
     * @inheritDoc
     */
    loadCategories = (): Promise<EResponseStatus> =>
        this.serviceLayer.getCategories().then((response) => {
            runInAction(() => {
                this.categories = response.data || [];
            });
            return response.status;
        });

    /**
     * @inheritDoc
     */
    *addAccount() {
        const response = yield this.serviceLayer.setAccounts([{...this.accountPrototype}], ESetMode.ADD, this.rootStore.authStore.password);

        if (response.status === EEncryptionStatus.SUCCESS) {
            this.accounts = response.data;
            // todo.NOTIFICATION
        }

        this.accountPrototype = getDefaultAccountPrototype();
    }
}
