import {makeAutoObservable, runInAction} from 'mobx';
import {IMainStore} from './Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {ESetMode} from 'Services/Enums';
import {set} from 'Utils/Utils';
import {IMainService} from '../Services/Models';
import {IAccount} from '../Models/Account';
import {getDefaultAccountPrototype} from './Consts';

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
    search: string = '';

    constructor(rootStore: IRootStore, serviceLayer: IMainService) {
        this.serviceLayer = serviceLayer;
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            serviceLayer: false,
            rootStore: false,
        });

        this.setAccounts = this.setAccounts.bind(this);
    }

    /**
     * @inheritDoc
     */
    get searchedAccounts() {
        return this.search ? [] : this.accounts;
    }

    /**
     * @inheritDoc
     */
    setFieldAccountPrototype = (path: string, data: any) => {
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
                });
            }

            return response.status;
        });

    /**
     * @inheritDoc
     */
    *setAccounts(accounts: IAccount[]) {
        this.accounts = yield this.serviceLayer.setAccounts(accounts, ESetMode.ADD, this.rootStore.authStore.password);
    }
}
