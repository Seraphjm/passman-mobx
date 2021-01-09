import {deleteDB as idbDeleteDB, openDB} from 'idb';
import {ICryptoStore, IDBServiceLayer, IResponse} from './Models';
import {ICategory} from 'Modules/Main/Store/Models';
import {BASE_NAME, defaultCategories, KEY_PATH} from './Consts';
import {ECryptoStorage, EDBMode, EResponseStatus, EStoreName} from './Enums';
import {IDBPDatabase} from 'idb/build/esm/entry';
import {decrypt, encrypt} from 'Utils/Crypto';
import {ICryptoInitData, IEncryptionResponse} from 'Utils/Crypto/Models';
import {updateStorage} from './Utils';
import {EEncryptionStatus} from '../Utils/Crypto/Enums';

/**
 * Сервсиный слой приложения, работующий непосредственно с indexedDB и api криптографии.
 */
class ServiceDB implements IDBServiceLayer {
    private dbPromise: Promise<IDBPDatabase>;
    private salt: ArrayBuffer = new Uint8Array();
    private iv: ArrayBuffer = new Uint8Array();

    constructor() {
        /**
         * Промисифицированный объект indexedDB.
         */
        this.dbPromise = openDB(BASE_NAME, 3, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    // eslint-disable-next-line
                    case 0:
                    // a placeholder case so that the switch block will
                    // execute when the database is first created
                    // (oldVersion is 0)
                    // eslint-disable-next-line
                    case 1:
                        db.createObjectStore(ECryptoStorage.ACCOUNTS, {keyPath: KEY_PATH});
                        db.createObjectStore(EStoreName.CATEGORIES, {keyPath: KEY_PATH});
                        db.createObjectStore(ECryptoStorage.USER_CATEGORIES, {keyPath: KEY_PATH});
                        db.createObjectStore(EStoreName.SETTINGS, {keyPath: EStoreName.SETTINGS, autoIncrement: true}).createIndex(
                            EStoreName.SETTINGS,
                            EStoreName.SETTINGS
                        );
                        db.createObjectStore(EStoreName.CRYPT, {keyPath: EStoreName.CRYPT, autoIncrement: true}).createIndex(
                            EStoreName.CRYPT,
                            EStoreName.CRYPT
                        );
                }
            },
        }).then((db: IDBPDatabase) => {
            this.serviceInit();
            return db;
        });
    }

    private serviceInit = async (): Promise<void> => {
        const init: ICryptoInitData = await this.getCryptInit();

        if (init) {
            this.salt = init.salt;
            this.iv = init.iv;
        }
    };

    /**
     * Приватный метод, удаляющий iv и salt.
     */
    private deleteCrypt = async (): Promise<void> => {
        this.iv = new Uint8Array();
        this.salt = new Uint8Array();

        this.dbPromise
            .then((db: IDBPDatabase) => {
                // TODO что-то
            })
            .catch((err: any) => console.error(err));
    };

    /**
     * @inheritDoc
     */
    private getCryptInit = (): Promise<ICryptoInitData> =>
        this.dbPromise.then((db: IDBPDatabase) =>
            db.transaction(EStoreName.CRYPT, EDBMode.READ_ONLY).objectStore(EStoreName.CRYPT).index(EStoreName.CRYPT).get(1)
        );

    /**
     * @inheritDoc
     */
    createDB = (password: string): Promise<IResponse> =>
        this.dbPromise
            .then(async (db: IDBPDatabase) => {
                await db
                    .transaction(EStoreName.CRYPT, EDBMode.READ_WRITE)
                    .objectStore(EStoreName.CRYPT)
                    .add({
                        iv: crypto.getRandomValues(new Uint8Array(12)),
                        salt: crypto.getRandomValues(new Uint8Array(32)),
                    });
            })
            .then(this.serviceInit)
            .then(() =>
                Promise.all([
                    this.setEncryptedData<[]>(ECryptoStorage.ACCOUNTS, password, []),
                    this.setEncryptedData(ECryptoStorage.USER_CATEGORIES, password, []),
                ])
            )
            .then(async () => {
                await this.setOpenData<ICategory[]>(EStoreName.CATEGORIES, defaultCategories);
            })
            .then(() => ({status: EResponseStatus.SUCCESS}))
            .catch((message) => ({status: EResponseStatus.ERROR, message}));

    /**
     * @inheritDoc
     */
    dbIsEmpty = async (): Promise<boolean> => !Boolean(await this.getCryptInit());

    /**
     * @inheritDoc
     */
    deleteDB = (): Promise<IResponse> =>
        idbDeleteDB(BASE_NAME).then(
            () => {
                this.deleteCrypt();
                return {status: EResponseStatus.SUCCESS};
            },
            (message) => ({status: EResponseStatus.ERROR, message})
        );

    /**
     * @inheritDoc
     */
    getEncryptedData = <T>(storage: ECryptoStorage, password: string): Promise<IEncryptionResponse<T>> =>
        this.dbPromise
            .then((db: IDBPDatabase) => db.transaction(storage, EDBMode.READ_ONLY).objectStore(storage).get(storage))
            .then(({data}: ICryptoStore) =>
                data === undefined
                    ? ({status: EEncryptionStatus.SUCCESS, data: []} as any)
                    : decrypt<T>(
                          password,
                          {
                              salt: this.salt,
                              iv: this.iv,
                          },
                          data
                      )
            );

    /**
     * @inheritDoc
     */
    setEncryptedData = async <T>(storage: ECryptoStorage, password: string, transferData: T): Promise<IResponse<T>> =>
        await encrypt<T>(
            password,
            {
                salt: this.salt,
                iv: this.iv,
            },
            transferData
        ).then((encryptedData: ArrayBuffer) =>
            this.dbPromise
                .then((db: IDBPDatabase) => updateStorage(db, storage, encryptedData))
                .then(
                    ({status}: IResponse) => ({status, data: transferData}),
                    ({status}: IResponse) => ({status, data: transferData})
                )
                .catch((message) => ({status: EResponseStatus.ERROR, data: transferData, message}))
        );

    /**
     * @inheritDoc
     */
    getOpenData = <T = unknown>(storage: EStoreName): Promise<IResponse<T>> =>
        this.dbPromise
            .then((db: IDBPDatabase) => db.transaction(storage, EDBMode.READ_ONLY).objectStore(storage).get(storage))
            .then(
                ({data}: IResponse<T>) => ({
                    status: EResponseStatus.SUCCESS,
                    data,
                }),
                (message) => ({
                    status: EResponseStatus.ERROR,
                    message,
                })
            )
            .catch((message) => ({status: EResponseStatus.ERROR, message}));

    /**
     * @inheritDoc
     */
    setOpenData = <T>(storage: EStoreName, transferData: T): Promise<IResponse<T>> =>
        this.dbPromise.then((db: IDBPDatabase) => updateStorage<T>(db, storage, transferData));
}

export const ServiceLayer: IDBServiceLayer = new ServiceDB();
