import {ICryptoInitData, IEncryptionResponse} from './Models';
import {EEncryptionStatus} from './Enums';

// TODO.CRITICAL replace to worker

/**
 * Кэш в котором хранится ключ, по ключу password + salt.
 */
const cache = new Map<string, CryptoKey>();

/**
 * Функция, запускающая генерацию ключа. Сгенерированный ключ кэшируется и из кэша же отдаётся.
 *
 * @param password Пользовательский пароль.
 * @param salt Соль.
 */
async function getCachedKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
    const cacheKey = password + salt;
    if (!cache.has(cacheKey)) {
        const importKey = await getImportKey(password);
        cache.set(cacheKey, await getKey(importKey, salt));
    }

    return cache.get(cacheKey) as CryptoKey;
}

/**
 * Функция, генерирующая ключ к зашифрованному хранилищу.
 *
 * @param importKey Пользовательский пароль переведённый в импортируемый формат по алгоритму PBKDF2.
 * @param salt Соль.
 */
function getKey(importKey: CryptoKey, salt: ArrayBuffer) {
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 1000000,
            hash: 'SHA-256',
        },
        importKey,
        {name: 'AES-GCM', length: 256},
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Функция, генерирующая ключ для импорта из пароля пользователя.
 *
 * @param password Пользовательский пароль.
 */
function getImportKey(password: string): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(password), {name: 'PBKDF2'}, false, ['deriveBits', 'deriveKey']);
}

/**
 * Функция, зашифровывающая переданные данные.
 *
 * @param password Пользовательский пароль.
 * @param salt Соль.
 * @param iv IV.
 * @param message Данные, которые необходимо зашифровать.
 */
export async function encrypt<T>(password: string, {iv, salt}: ICryptoInitData, message: T): Promise<ArrayBuffer> {
    const targetMessage: string = JSON.stringify(message);
    const key = await getCachedKey(password, salt);

    return crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
            length: 256,
        },
        key,
        new TextEncoder().encode(targetMessage)
    );
}

/**
 * Функция, расфровывающая переданные данные.
 *
 * @param password Пользовательский пароль.
 * @param salt Соль.
 * @param iv IV.
 * @param message Данные, которые необходимо расшифровать.
 */
export async function decrypt<T>(
    password: string,
    {iv, salt}: ICryptoInitData,
    message: ArrayBuffer
): Promise<IEncryptionResponse<T | []> | void> {
    const key: CryptoKey = await getCachedKey(password, salt);

    return crypto.subtle
        .decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            message
        )
        .then(
            (decrypted): IEncryptionResponse<T> => ({
                status: EEncryptionStatus.SUCCESS,
                data: JSON.parse(new TextDecoder().decode(decrypted)),
            }),
            (): IEncryptionResponse<[]> => ({status: EEncryptionStatus.ERROR, data: []})
        )
        .catch((err) => console.error('*** Decryption error ***', err));
}
