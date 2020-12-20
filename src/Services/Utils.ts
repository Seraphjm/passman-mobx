import {IDBPDatabase} from 'idb/build/esm/entry';
import {ECryptoStorage, EDBMode, EResponseStatus, EStoreName} from './Enums';
import {IResponse} from './Models';

/**
 * Функция, иммутабельно добавляющая новые элементы в переданный целевой массив.
 *
 * @param targetArray Целевой массив.
 * @param items Переданные элементы на добавление в целевой массив.
 */
export function addItemsFromArray<T>(targetArray: T[], items: T[]): T[] {
    return [...targetArray, ...items];
}

/**
 * Функция, иммутабельно удаляющая указанные в items элементы в переданном целевом массиве.
 *
 * @param targetArray Целевой массив.
 * @param items Переданные элементы по которым необходимо осуществить удаление.
 * @param by Ключ, по которому необходимо удалить элемент. По умолчанию, используется _id.
 */
export function removeItemsFromArray<T>(targetArray: T[], items: T[], by: string = '_id'): T[] {
    return targetArray.filter((sourceItem: T | any) => items.find((item: T | any) => item[by] === sourceItem[by]));
}

/**
 * Функция, иммутабельно редактирующая указанные в items элементы в переданном целевом массиве.
 *
 * @param targetArray Целевой массив.
 * @param items Переданные элементы по которым необходимо осуществить редактирование.
 * @param by Ключ, по которому необходимо редактировать элемент. По умолчанию, используется _id.
 */
export function editItemsFromArray<T>(targetArray: T[], items: T[], by: string = '_id'): T[] {
    return targetArray.map((sourceItem: T | any) => items.find((item: T | any) => item[by] === sourceItem[by]) || sourceItem);
}

/**
 * Функция, осуществляющая транзакцию на запись в указанную сущность.
 *
 * @param db Объект открытого коннекта к indexedDB.
 * @param txStorage Имя сущности в которую необходимо произвести запись.
 * @param data Данные, которые необходимо записать в указанную в txStorage сущность indexedDB.
 */
function updateStorage<T>(db: IDBPDatabase, txStorage: EStoreName, data: T): Promise<IResponse<T>>;
function updateStorage(db: IDBPDatabase, txStorage: ECryptoStorage, data: ArrayBuffer): Promise<IResponse<ArrayBuffer>>;
async function updateStorage(db: any, txStorage: any, data: any): Promise<any> {
    const tx = db.transaction(txStorage, EDBMode.READ_WRITE);
    const store = tx.objectStore(txStorage);

    try {
        await store.put({_id: txStorage, data});
        return {status: EResponseStatus.SUCCESS, data};
    } catch (message) {
        await tx.abort();
        return {status: EResponseStatus.ERROR, data, message};
    }
}
/**
 * Т.к. используется перегрузка, необходимо выполнить экспорт таким образом.
 */
export {updateStorage};
