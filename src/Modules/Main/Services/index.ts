import {ECryptoStorage, EResponseStatus, ESetMode} from 'Services/Enums';
import {IDBServiceLayer, IResponse} from 'Services/Models';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {EStoreName} from 'Services/Enums';
import {addItemsFromArray, editItemsFromArray, removeItemsFromArray} from 'Services/Utils';
import {IMainService} from './Models';
import {IAccount} from '../Models/Account';
import {ICategory} from '../Store/Models';

/**
 * Сервисный слой модуля главной страницы.
 */
export class MainService implements IMainService {
    /**
     * @inheritDoc
     */
    serviceLayer: IDBServiceLayer;

    constructor(serviceLayer: IDBServiceLayer) {
        this.serviceLayer = serviceLayer;
    }

    /**
     * @inheritDoc
     */
    getAccounts = (password: string): Promise<IEncryptionResponse<IAccount[]>> =>
        this.serviceLayer.getEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, password);

    /**
     * @inheritDoc
     */
    setAccounts = async (accounts: IAccount[], mode: ESetMode, password: string): Promise<IResponse<IAccount[]>> => {
        if (mode === undefined) return {status: EResponseStatus.ERROR}; // todo.NOTIFICATION

        const {data: accountsFromStore = [], status}: IEncryptionResponse<IAccount[]> = await this.getAccounts(password);

        if (status === EEncryptionStatus.ERROR) return {status: EResponseStatus.ERROR}; // todo.NOTIFICATION

        let transferData = accountsFromStore;

        switch (mode) {
            case ESetMode.ADD:
                transferData = await addItemsFromArray<IAccount>(accountsFromStore, accounts);
                break;
            case ESetMode.EDIT:
                transferData = await editItemsFromArray<IAccount>(accountsFromStore, accounts);
                break;
            case ESetMode.DELETE:
                transferData = await removeItemsFromArray<IAccount>(accountsFromStore, accounts);
                break;

            default:
                return {status: EResponseStatus.ERROR}; // todo.NOTIFICATION
        }

        return this.serviceLayer.setEncryptedData<IAccount[]>(ECryptoStorage.ACCOUNTS, password, transferData);
    };

    /**
     * @inheritDoc
     */
    getCategories = (): Promise<IResponse<ICategory[]>> => this.serviceLayer.getOpenData<ICategory[]>(EStoreName.CATEGORIES);

    /**
     * @inheritDoc
     */
    getUserCategories = (password: string): any[] => [];

    /**
     * @inheritDoc
     */
    setUserCategories = (categories: any[], password: string): any => {};
}
