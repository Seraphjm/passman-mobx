import {makeAutoObservable, runInAction} from 'mobx';
import {ICategory, IMainStore} from './Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {EResponseStatus, ESetMode} from 'Services/Enums';
import {set} from 'Utils/Utils';
import {clearObserve} from 'Store/Utils';
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
    /**
     * @inheritDoc
     */
    selectedAccounts: IAccount[] = [];

    constructor(rootStore: IRootStore, serviceLayer: IMainService) {
        this.serviceLayer = serviceLayer;
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            serviceLayer: false,
            rootStore: false,
        });

        this.addAccount = this.addAccount.bind(this);
        this.setSelectedAccounts = this.setSelectedAccounts.bind(this);
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
    setSelectedAccounts(mode: ESetMode.ADD, account: IAccount): void;
    setSelectedAccounts(mode: ESetMode.DELETE, account: IAccount): void;
    setSelectedAccounts(mode: ESetMode.CLEAR, account?: never): void;
    setSelectedAccounts(mode: any, account: any): any {
        switch (mode) {
            case ESetMode.ADD:
                this.selectedAccounts.push(account);
                break;

            case ESetMode.DELETE:
                this.selectedAccounts.splice(this.selectedAccounts.indexOf(account), 1);
                break;

            case ESetMode.CLEAR:
                this.selectedAccounts.splice(0, this.selectedAccounts.length);
                break;

            default:
                break;
        }
    }

    /**
     * @inheritDoc
     */
    setAccountPrototype = (account: IAccount): void => {
        this.accountPrototype = clearObserve(account);
    };

    /**
     * @inheritDoc
     */
    editAccount = (account: IAccount): Promise<void> =>
        this.serviceLayer
            .editAccount(clearObserve<IAccount>(account, {}), this.rootStore.authStore.password)
            .then((response: IEncryptionResponse<IAccount[]>) => {
                if (response.status === EEncryptionStatus.SUCCESS) {
                    runInAction(() => {
                        console.log(response.data);
                        this.accounts = response.data || [];
                    });
                } else {
                }
            });

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
        const response = yield this.serviceLayer.addAccount(this.accountPrototype, this.rootStore.authStore.password);

        if (response.status === EEncryptionStatus.SUCCESS) {
            this.accounts = response.data;
            // todo.NOTIFICATION
        }

        this.accountPrototype = getDefaultAccountPrototype();
    }
}
