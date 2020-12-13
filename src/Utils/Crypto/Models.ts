import {EEncryptionStatus} from './Enums';

/**
 * Модель инициализационных данных для криптографии.
 *
 * @prop salt соль.
 * @prop iv IV.
 */
export interface ICryptoInitData {
    salt: ArrayBuffer;
    iv: ArrayBuffer;
}

/**
 * Модель ответа результата выполнения криптографии.
 *
 * @prop status Статус прошедшей операции.
 * @prop message Сообщение. Обычно это error.message.
 * @prop data Возвращаемые на выходе данные.
 */
export interface IEncryptionResponse<T = unknown> {
    status: EEncryptionStatus;
    message?: string;
    data?: T;
}
