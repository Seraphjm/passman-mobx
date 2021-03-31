import {makeAutoObservable, runInAction, toJS} from 'mobx';
import {ICategory, IMainStore} from './Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
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
    selectedCategory: string = '';
    /**
     * @inheritDoc
     */
    search: string = 'v';
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
        return this.accounts.slice().sort((a, b) => (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1));
    }

    /**
     * @inheritDoc
     */
    get enabledCategories() {
        return this.categories.filter((category) => this.accounts.some((account) => category.id === account.category));
    }

    /**
     * @inheritDoc
     */
    get activeCategory() {
        return this.selectedCategory || this.enabledCategories[0]?.id;
    }

    /**
     * @inheritDoc
     */
    get showedAccounts() {
        return this.search ? this.searchedAccounts : this.sortedAccounts.filter((account) => account.category === this.activeCategory);
    }

    /**
     * @inheritDoc
     */
    get searchedAccounts() {
        return [];
    }

    /**
     * @inheritDoc
     */
    get protoCategoryFields() {
        return this.categories.find((category) => category.id === this.accountPrototype.category)?.fields || [];
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
        this.accountPrototype = toJS(account);
    };

    /**
     * @inheritDoc
     */
    setSearch = (search: string): void => {
        this.search = search;
    };

    /**
     * @inheritDoc
     */
    setSelectedCategory = (id: string): void => {
        this.selectedCategory = id;
    };

    /**
     * @inheritDoc
     */
    editAccount = (account: IAccount): Promise<void> => {
        const updateDate = new Date().toISOString();
        const payload: IAccount = {...toJS(account), lastUpdate: updateDate};
        const i = this.accounts.findIndex(({_id}) => _id === account._id);

        if (this.accounts[i].data.password !== payload.data.password) {
            payload.passwordLastUpdate = updateDate;
        }

        return this.serviceLayer.editAccount(payload, this.rootStore.authStore.password).then((response: IEncryptionResponse<IAccount>) => {
            if (response.status === EEncryptionStatus.SUCCESS) {
                runInAction(() => {
                    this.accounts[i] = response.data || payload;
                });
            } else {
                // todo.NOTIFICATION
            }
        });
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
        const response = yield this.serviceLayer.addAccount(this.accountPrototype, this.rootStore.authStore.password);

        if (response.status === EEncryptionStatus.SUCCESS) {
            this.accounts.push(toJS(this.accountPrototype));
            // todo.NOTIFICATION
        }

        this.accountPrototype = getDefaultAccountPrototype();
    }
}
