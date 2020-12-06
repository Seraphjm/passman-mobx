import {ECryptoStorage, EResponseStatus, ESetMode} from 'Services/Enums';
import {IDBServiceLayer, IInitStores, IResponse} from 'Services/Models';
import {IEncryptionResponse} from 'Utils/Crypto/Models';
import {EEncryptionStatus} from 'Utils/Crypto/Enums';
import {addItemsFromArray, editItemsFromArray, removeItemsFromArray} from 'Services/Utils';
import {IMainService} from './Models';
import {IAccount} from '../Models/Account';

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
    setAccounts = async (
        accounts: IAccount[],
        mode: ESetMode = ESetMode.ADD,
        password: string
    ): Promise<IResponse<IAccount[] | IInitStores<IAccount[]>>> => {
        const {data: accountsFromStore = [], status}: IEncryptionResponse<IAccount[]> = await this.getAccounts(password);

        if (status === EEncryptionStatus.ERROR) return {status: EResponseStatus.ERROR};

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
                throw Error('something wrong');
        }

        return this.serviceLayer.setEncryptedData(ECryptoStorage.ACCOUNTS, password, transferData);
    };

    /**
     * @inheritDoc
     */
    getCategories = (categories: any[]): any => {};

    /**
     * @inheritDoc
     */
    getUserCategories = (password: string): any[] => [];

    /**
     * @inheritDoc
     */
    setUserCategories = (categories: any[], password: string): any => {};
}
