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
            .then(async (db: IDBPDatabase) => {
                await db
                    .transaction(EStoreName.CRYPT, EDBMode.READ_WRITE)
                    .objectStore(EStoreName.CRYPT)
                    .add({
                        iv: crypto.getRandomValues(new Uint8Array(12)),
                        salt: crypto.getRandomValues(new Uint8Array(32)),
                    });
            })
            .then(serviceInit)
            .then(() =>
                Promise.all([
                    setEncryptedData<[]>(ECryptoStorage.ACCOUNTS, password, []),
                    setEncryptedData(ECryptoStorage.USER_CATEGORIES, password, []),
                ])
            )
            .then(async () => {
                await setOpenData<ICategory[]>(EStoreName.CATEGORIES, defaultCategories);
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
     * Приватный метод, удаляющий iv и salt.
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
            .then(({data}: ICryptoStore) => {
                return data === undefined
                    ? ({status: EEncryptionStatus.SUCCESS, data: []} as any)
                    : decrypt<T>(
                          password,
                          {
                              salt,
                              iv,
                          },
                          data
                      );
            });
    }

    /**
     * @inheritDoc
     */
    async function setEncryptedData<T>(storage: ECryptoStorage, password: string, transferData: T): Promise<IResponse<T>> {
        const encryptedData = await encrypt<T>(
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
    function getOpenData<T = unknown>(storage: EStoreName): Promise<IResponse<T>> {
        return dbPromise
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
        getEncryptedData,
        setEncryptedData,
        getOpenData,
        setOpenData,
    };
})();
