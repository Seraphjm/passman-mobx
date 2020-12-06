import {ECryptoStorage, EResponseStatus, EStoreName} from './Enums';
import {IEncryptionResponse} from 'Utils/Crypto/Models';

export interface IDBServiceLayer {
    /**
     * Метод, проверяющая была ли ранее инициализированна БД под паролем пользователя.
     */
    dbIsEmpty: () => Promise<boolean>;

    /**
     * Метод, создающий базу данных.
     *
     * @param password Пароль пользователя.
     */
    createDB: (password: string) => Promise<IResponse>;

    /**
     * Метод, удаляющий БД.
     */
    deleteDB: () => Promise<IResponse>;

    /**
     * TODO
     */
    generateCrypt: () => any;

    /**
     * TODO
     */
    deleteCrypt: () => any;

    /**
     * Метод, возвращающий расшифрованные данные из указанной зашифрованной сущности в БД.
     *
     * @param storage Шифрованная сущность, из которой запрашираются данные.
     * @param password Пароль пользователя.
     */
    getEncryptedData: <T>(storage: ECryptoStorage, password: string) => Promise<IEncryptionResponse<T>>;

    /**
     * Метод, изменяющий данные в указанной зашифрованной сущности.
     *
     * @param storage Шифрованная сущность, в которую записываются зашифрованные данные.
     * @param password Пароль пользователя.
     * @param transferData Переданные данные, которые необходимо зашифровать и записать.
     */
    setEncryptedData: <T>(
        storage: ECryptoStorage,
        password: string,
        transferData: T | IInitStores<T>
    ) => Promise<IResponse<T | IInitStores<T>>>;

    /**
     * Метод, возвращающий открыте данные из указанной сущности в БД.
     *
     * @param storage Сущность, из которой запрашираются открытые данные.
     */
    getOpenData: <T = unknown>(storage: EStoreName) => Promise<T>;

    /**
     * Метод, возвращающий открыте данные из указанной сущности в БД.
     *
     * @param storage Сущность, в которую записываются открытые данные.
     * @param transferData Переданные данные в открытом виде, которые необходимо и записать.
     */
    setOpenData: <T>(storage: EStoreName, transferData: T) => Promise<IResponse<T>>;
}

/**
 * Модель объекта зашифрованных данных в indexedDB.
 *
 * @prop _id статичный идентификатор объекта по которому осуществляется доступ к зашифрованным данным.
 * @prop data Зашифрованные данные.
 */
export interface ICryptoStore {
    _id: ECryptoStorage;
    data: ArrayBuffer | undefined;
}

/**
 * Модель объекта ответа взаимодействий с indexedDB.
 *
 * @prop status Статус ответа.
 * @prop [message] Сообщение к ответу. Обычно это error.message.
 * @prop [data] Данные, которые передавались на запись в indexedDB.
 */
export interface IResponse<T = unknown> {
    status: EResponseStatus;
    message?: unknown;
    data?: T;
}

/**
 * Модель данных которые записываются в различные сущности при инициализации indexedDB.
 *
 * @prop _id статичный идентификатор объекта по которому осуществляется доступ к зашифрованным данным.
 * @prop data Инициализационные данные.
 */
export interface IInitStores<T> {
    _id: ECryptoStorage;
    data: T;
}
