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
 * @param hide Флаг на скрытие пароля.
 * @param password Переданный пароль.
 */
export const hidePass = (hide: boolean, password: string): string => (hide ? '•'.repeat(password.length) : password);

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
