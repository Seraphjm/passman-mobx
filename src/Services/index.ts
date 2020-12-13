import {deleteDB as idbDeleteDB, openDB} from 'idb';
import {ICryptoStore, IDBServiceLayer, IInitStores, IResponse} from './Models';
import {BASE_NAME, KEY_PATH} from './Consts';
import {ECryptoStorage, EDBMode, EResponseStatus, EStoreName} from './Enums';
import {IDBPDatabase} from 'idb/build/esm/entry';
import {decrypt, encrypt} from 'Utils/Crypto';
import {ICryptoInitData, IEncryptionResponse} from '../Utils/Crypto/Models';
import {updateStorage} from './Utils';
import {EEncryptionStatus} from '../Utils/Crypto/Enums';

export const ServiceLayer = ((): IDBServiceLayer => {
    /**
     * Промисифицированный объект indexedDB. Приватное поле.
     */
    const dbPromise: Promise<IDBPDatabase> = openDB(BASE_NAME, 3, {
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
    });

    /**
     * @inheritDoc
     */
    serviceInit();

    let salt: ArrayBuffer = new Uint8Array();
    let iv: ArrayBuffer = new Uint8Array();

    async function serviceInit(): Promise<void> {
        const init: ICryptoInitData = await getCryptInit();

        if (init) {
            salt = init.salt;
            iv = init.iv;
        }
    }

    /**
     * @inheritDoc
     */
    function createDB(password: string): Promise<IResponse> {
        return dbPromise
            .then((db: IDBPDatabase) => {
                db.transaction(EStoreName.CRYPT, EDBMode.READ_WRITE)
                    .objectStore(EStoreName.CRYPT)
                    .add({
                        iv: crypto.getRandomValues(new Uint8Array(12)),
                        salt: crypto.getRandomValues(new Uint8Array(32)),
                    });
            })
            .then(serviceInit)
            .then(() => {
                setEncryptedData<IInitStores<[]>>(ECryptoStorage.ACCOUNTS, password, {
                    _id: ECryptoStorage.ACCOUNTS,
                    data: [],
                });
                setEncryptedData(ECryptoStorage.USER_CATEGORIES, password, {
                    _id: ECryptoStorage.USER_CATEGORIES,
                    data: [],
                });
            })
            .then(() => {
                return {status: EResponseStatus.SUCCESS};
            })
            .catch((message) => ({status: EResponseStatus.ERROR, message}));
    }

    /**
     * @inheritDoc
     */
    async function dbIsEmpty(): Promise<boolean> {
        return !Boolean(await getCryptInit());
    }

    /**
     * @inheritDoc
     */
    function getCryptInit(): Promise<ICryptoInitData> {
        return dbPromise.then((db: IDBPDatabase) =>
            db.transaction(EStoreName.CRYPT, EDBMode.READ_ONLY).objectStore(EStoreName.CRYPT).index(EStoreName.CRYPT).get(1)
        );
    }

    /**
     * @inheritDoc
     */
    function deleteDB(): Promise<IResponse> {
        return idbDeleteDB(BASE_NAME).then(
            () => {
                deleteCrypt();
                return {status: EResponseStatus.SUCCESS};
            },
            (message) => ({status: EResponseStatus.ERROR, message})
        );
    }

    /**
     * @inheritDoc
     */
    function generateCrypt() {}

    /**
     * @inheritDoc
     */
    async function deleteCrypt() {
        iv = new Uint8Array();
        salt = new Uint8Array();

        dbPromise
            .then((db: IDBPDatabase) => {
                // TODO
            })
            .catch((err) => console.error(err));
    }

    /**
     * @inheritDoc
     */
    function getEncryptedData<T>(storage: ECryptoStorage, password: string): Promise<IEncryptionResponse<T>> {
        return dbPromise
            .then((db: IDBPDatabase) => db.transaction(storage, EDBMode.READ_ONLY).objectStore(storage).get(storage))
            .then(({data}: ICryptoStore) =>
                !data
                    ? ({status: EEncryptionStatus.SUCCESS, data: []} as any)
                    : decrypt<T>(
                          password,
                          {
                              salt,
                              iv,
                          },
                          data
                      )
            );
    }

    /**
     * @inheritDoc
     */
    async function setEncryptedData<T>(
        storage: ECryptoStorage,
        password: string,
        transferData: T | IInitStores<T>
    ): Promise<IResponse<T | IInitStores<T>>> {
        const encryptedData = await encrypt<T | IInitStores<T>>(
            password,
            {
                iv,
                salt,
            },
            transferData
        );

        return dbPromise
            .then((db: IDBPDatabase) => updateStorage(db, storage, encryptedData))
            .then(
                ({status}: IResponse) => ({status, data: transferData}),
                ({status}: IResponse) => ({status, data: transferData})
            )
            .catch((message) => ({status: EResponseStatus.ERROR, data: transferData, message}));
    }

    /**
     * @inheritDoc
     */
    function getOpenData<T = unknown>(storage: EStoreName): Promise<T> {
        return dbPromise.then((db: IDBPDatabase) => db.transaction(storage, EDBMode.READ_ONLY).objectStore(storage).get(storage));
    }

    /**
     * @inheritDoc
     */
    function setOpenData<T>(storage: EStoreName, transferData: T): Promise<IResponse<T>> {
        return dbPromise.then((db: IDBPDatabase) => updateStorage<T>(db, storage, transferData));
    }

    return {
        dbIsEmpty,
        createDB,
        deleteDB,
        generateCrypt,
        deleteCrypt,
        getEncryptedData,
        setEncryptedData,
        getOpenData,
        setOpenData,
    };
})();
