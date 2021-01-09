import {EPasswordPatterns} from './Enums';

/**
 * Возвращает строкой случайное значение от 000000 до FFFFFF.
 */
export const getRandomHex = (): string => ((Math.random() * 0xffffff) << 0).toString(16);

/**
 * Переводит в upperCase первый символ входящей строки.
 *
 * @param string Передаваемая строка.
 */
export const capitalizeFirstLetter = ([first, ...rest]: string): string => [first.toLocaleUpperCase(), ...rest].join('');

/**
 * Функция скрывающая пароль по переданному флагу.
 *
 * @param password Переданный пароль.
 * @param ignore Флаг на скрытие пароля.
 */
export const hidePassword = (password: string, ignore?: boolean): string => (ignore ? password : '•'.repeat(password.length));

/**
 * Функция создающая криптографически случайный пароль по заданной длинне и паттерну.
 *
 * @param length Длина пароля.
 * @param pattern Паттерн, по которому требуется создать пароль.
 */
export const passwordGenerate = (length: number = 16, pattern: EPasswordPatterns = EPasswordPatterns.LOWER_UPPER_NUMBER_): string => {
    const currentPatterns = {
        [EPasswordPatterns.LOWER_UPPER_NUMBER]: /[a-zA-Z0-9]/,
        [EPasswordPatterns.LOWER_UPPER_NUMBER_]: /[a-zA-Z0-9_]/,
        [EPasswordPatterns.LOWER_UPPER_NUMBER_SPECIAL]: /[a-zA-Z0-9_!@#$%^&*+]/,
    }[pattern];

    //@ts-ignore
    return Array.apply(null, {length})
        .map(() => {
            let result = '';
            while (true) {
                result = String.fromCharCode(crypto.getRandomValues(new Uint8Array(1))[0]);
                if (currentPatterns.test(result)) return result;
            }
        })
        .join('');
};

/**
 * Функция проверяющая, что переданное значение является функцией.
 *
 * @param value Проверяемое значение.
 */
export const isFunction = (value: unknown): boolean => typeof value === 'function';

/**
 * Более легковесный аналог lodash.set.
 *
 * @param object Объект в котором необходимо установить свойство.
 * @param path Путь до свойства. Описывается через <<.>>.
 * @param data Данные, которые необходимо установить по указанному свойству.
 *
 * @example set(obj, 'prop.nested.value', 42)
 */
export const set = <T>(object: T, path: string, data: unknown) => {
    if (typeof path !== 'string' || !object || data == null) return;

    const keys = path.split('.');
    const lastIndex = keys.length - 1;
    let i = 0;
    let nested = object;

    while (nested && i < keys.length) {
        // @ts-ignore todo не очевидно как типизировать, если вообще возможно.
        i !== lastIndex ? (nested = nested[keys[i++]]) : (nested[keys[i++]] = data);
    }
};

/**
 * Функция копирующая переданное значение в буфер обмена.
 *
 * @param value Копируемое значение.
 */
export const copyToClipboard = (value: string): string => {
    // @ts-ignore
    const copypasted: HTMLInputElement = document.getElementById('copypasted');

    copypasted.value = value;
    copypasted.select();
    document.designMode = 'on';
    document.execCommand('copy');
    document.designMode = 'off';
    copypasted.value = '';

    return value;
};

/**
 * Функция возвращающая uuid.
 *
 * @example b970d1da-4aa7-19d4-7881-974f95d5ad39.
 */
export const uuid = (): string => {
    let key: string = '';

    for (let block = 0; 5 > block; block++) {
        const getLength = block === 0 ? 8 : block < 4 ? 4 : 12;
        const rnd = window.crypto.getRandomValues(new Uint32Array(2));
        const hex = (rnd[0].toString(16) + rnd[1].toString(16)).substring(0, getLength);

        block < 4 ? (key += `${hex}-`) : (key += hex);
    }

    return key;
};
