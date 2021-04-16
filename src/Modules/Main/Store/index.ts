import {makeAutoObservable, runInAction, toJS} from 'mobx';
import {ICategory, IMainStore} from './Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {EResponseStatus, ESetMode} from 'Services/Enums';
import {mutableFilter, set} from 'Utils/Utils';
import {IMainService} from '../Services/Models';
import {IAccount} from '../Models/Account';
import {getDefaultAccountPrototype} from './Consts';
import {go} from 'fuzzysort';
import {IFuzzySortResult} from 'Common/Models';
import {getSortedSubcategoriesFromAccounts} from '../Utils';

/**
 * Стор главной страницы приложеия.
 */
export class MainStore implements IMainStore {
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
    selectedSubcategory: string = '';
    /**
     * @inheritDoc
     */
    selectedCategory: string = '';
    /**
     * @inheritDoc
     */
    search: string = '';
    /**
     * @inheritDoc
     */
    selectedAccounts: IAccount[] = [];

    constructor(serviceLayer: IMainService) {
        this.serviceLayer = serviceLayer;

        makeAutoObservable(this, {
            serviceLayer: false,
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
        return this.categories.filter((category) => this.accounts.some((account) => category.id === account.categoryId));
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
    get subcategories() {
        return getSortedSubcategoriesFromAccounts(this.accounts);
    }

    /**
     * @inheritDoc
     */
    get currentSubcategoryList() {
        return getSortedSubcategoriesFromAccounts(this.currentCategoryAccounts);
    }

    /**
     * @inheritDoc
     */
    get currentCategoryAccounts() {
        return this.search ? [] : this.sortedAccounts.filter((account) => account.categoryId === this.activeCategory);
    }

    /**
     * @inheritDoc
     */
    get showedAccounts() {
        return this.search
            ? this.searchedAccounts
            : !this.selectedSubcategory
            ? this.currentCategoryAccounts
            : this.currentCategoryAccounts.filter((account) => this.selectedSubcategory === account.subcategory);
    }

    /**
     * @inheritDoc
     */
    get searchedAccounts() {
        //@ts-ignore
        const filtered: IFuzzySortResult<IAccount>[] = go<IAccount>(this.search, this.accounts, {
            limit: 100,
            key: 'name',
        });

        return filtered.length ? (filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({obj}) => obj) as IAccount[]) : [];
    }

    /**
     * @inheritDoc
     */
    get protoCategoryFields() {
        return this.categories.find((category) => category.id === this.accountPrototype.categoryId)?.fields || [];
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
    setSelectedSubcategory = (subcategory: string): void => {
        this.selectedSubcategory = subcategory;
    };

    /**
     * @inheritDoc
     */
    setSearch = (search: string): void => {
        if (this.selectedAccounts.length) this.setSelectedAccounts(ESetMode.CLEAR);
        if (this.selectedSubcategory) this.setSelectedSubcategory('');

        this.search = search;
    };

    /**
     * @inheritDoc
     */
    setSelectedCategory = (id: string): void => {
        this.setSelectedSubcategory('');
        this.setSelectedAccounts(ESetMode.CLEAR);
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

        return this.serviceLayer.editAccount(payload).then((response: IEncryptionResponse<IAccount>) => {
            if (response.status === EEncryptionStatus.SUCCESS && response.data) {
                runInAction(() => {
                    //@ts-ignore ложноположительное срабатывание. Проверка response.data сделана выше.
                    this.accounts[i] = response.data;
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
        this.serviceLayer.getAccounts().then((response) => {
            if (response.status === EEncryptionStatus.SUCCESS && response.data) {
                runInAction(() => {
                    //@ts-ignore ложноположительное срабатывание. Проверка response.data сделана выше.
                    this.accounts = response.data;
                });
            } else {
                // todo.NOTIFICATION
            }

            return response.status;
        });

    /**
     * @inheritDoc
     */
    loadCategories = (): Promise<EResponseStatus> =>
        this.serviceLayer.getCategories().then((response) => {
            if (response.status === EResponseStatus.SUCCESS && response.data) {
                runInAction(() => {
                    //@ts-ignore ложноположительное срабатывание. Проверка response.data сделана выше.
                    this.categories = response.data;
                });
            } else {
                // todo.NOTIFICATION
            }
            return response.status;
        });

    /**
     * @inheritDoc
     */
    *addAccount(): Generator<Promise<IEncryptionResponse<IAccount[]>>, void, IEncryptionResponse<IAccount[]>> {
        const response = yield this.serviceLayer.addAccount(this.accountPrototype);

        if (response.status === EEncryptionStatus.SUCCESS) {
            this.accounts.push(toJS(this.accountPrototype));
        } else {
            // todo.NOTIFICATION
        }

        this.accountPrototype = getDefaultAccountPrototype();
    }

    /**
     * @inheritDoc
     */
    *removeAccounts(accounts: IAccount[]): Generator<Promise<IEncryptionResponse<IAccount[]>>, void, IEncryptionResponse<IAccount[]>> {
        const response = yield this.serviceLayer.removeAccounts(accounts);

        if (response.status === EEncryptionStatus.SUCCESS && response.data) {
            //@ts-ignore ложноположительное срабатывание. Проверка response.data сделана выше.
            yield mutableFilter<IAccount>(this.accounts, (account) => response.data.some(({_id}) => _id === account._id));
        } else {
            // todo.NOTIFICATION
        }

        this.setSelectedAccounts(ESetMode.CLEAR);

        this.accountPrototype = getDefaultAccountPrototype();
    }
}
