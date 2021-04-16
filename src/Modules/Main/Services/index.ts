import {ECryptoStorage} from 'Services/Enums';
import {IDBServiceLayer, IResponse} from 'Services/Models';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {EStoreName} from 'Services/Enums';
import {addItemToArray, editItemInArray, removeItemsFromArray} from 'Services/Utils';
import {IMainService} from './Models';
import {IAccount} from '../Models/Account';
import {ICategory} from '../Store/Models';
import {IRootStore} from '../../../Store/Models';
import {makeAutoObservable} from 'mobx';

/**
 * Сервисный слой модуля главной страницы.
 */
export class MainService implements IMainService {
    /**
     * @inheritDoc
     */
    rootStore: IRootStore;
    /**
     * @inheritDoc
     */
    serviceLayer: IDBServiceLayer;

    constructor(rootStore: IRootStore, serviceLayer: IDBServiceLayer) {
        this.rootStore = rootStore;
        this.serviceLayer = serviceLayer;

        makeAutoObservable(this, {
            rootStore: false,
        });
    }

    /**
     * @inheritDoc
     */
    getAccounts = (): Promise<IEncryptionResponse<IAccount[]>> =>
        this.serviceLayer.getEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, this.rootStore.authStore.password);

    /**
     * @inheritDoc
     */
    addAccount = async (account: IAccount): Promise<IEncryptionResponse<IAccount[]>> => {
        const {data: accountsFromStore = [], status}: IEncryptionResponse<IAccount[]> = await this.getAccounts();

        if (status === EEncryptionStatus.ERROR) return {status: EEncryptionStatus.ERROR}; // todo.NOTIFICATION

        try {
            const transferData = await addItemToArray<IAccount>(accountsFromStore, account);
            return this.serviceLayer.setEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, this.rootStore.authStore.password, transferData);
        } catch (e) {
            return {status: EEncryptionStatus.ERROR, message: e}; // todo.NOTIFICATION
        }
    };

    /**
     * @inheritDoc
     */
    editAccount = async (account: IAccount): Promise<IEncryptionResponse<IAccount>> => {
        const {data: accountsFromStore = [], status}: IEncryptionResponse<IAccount[]> = await this.getAccounts();

        if (status === EEncryptionStatus.ERROR) return {status: EEncryptionStatus.ERROR}; // todo.NOTIFICATION

        try {
            const transferData = await editItemInArray<IAccount>(accountsFromStore, account);
            return this.serviceLayer
                .setEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, this.rootStore.authStore.password, transferData)
                .then((resp) => ({
                    ...resp,
                    data: account,
                }));
        } catch (e) {
            return {status: EEncryptionStatus.ERROR, message: e}; // todo.NOTIFICATION
        }
    };

    /**
     * @inheritDoc
     */
    removeAccounts = async (accounts: IAccount[]): Promise<IEncryptionResponse<IAccount[]>> => {
        const {data: accountsFromStore = [], status}: IEncryptionResponse<IAccount[]> = await this.getAccounts();

        if (status === EEncryptionStatus.ERROR) return {status: EEncryptionStatus.ERROR}; // todo.NOTIFICATION

        try {
            const transferData = await removeItemsFromArray<IAccount>(accountsFromStore, accounts);
            return this.serviceLayer.setEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, this.rootStore.authStore.password, transferData);
        } catch (e) {
            return {status: EEncryptionStatus.ERROR, message: e}; // todo.NOTIFICATION
        }
    };

    /**
     * @inheritDoc
     */
    getCategories = (): Promise<IResponse<ICategory[]>> => this.serviceLayer.getOpenData<ICategory[]>(EStoreName.CATEGORIES);

    /**
     * @inheritDoc
     */
    getUserCategories = (): any[] => [];

    /**
     * @inheritDoc
     */
    setUserCategories = (categories: any[]): any => {};
}
