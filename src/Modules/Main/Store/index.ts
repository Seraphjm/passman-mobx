import {makeAutoObservable, runInAction} from 'mobx';
import {IMainStore} from './Models';
import {IRootStore} from 'Store/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {IMainService} from '../Services/Models';
import {IAccount} from '../Models/Account';
import {ESetMode} from '../../../Services/Enums';

export class MainStore implements IMainStore {
    /**
     * @inheritDoc
     */
    rootStore: IRootStore;
    /**
     * @inheritDoc
     */
    accounts: IAccount[] = [];
    /**
     * @inheritDoc
     */
    serviceLayer: IMainService;

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
