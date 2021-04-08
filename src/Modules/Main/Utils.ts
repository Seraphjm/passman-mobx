import {EPluralPeriod, getLocalePluralPeriod} from 'i18n';
import {ELanguage} from 'Modules/Settings/Enums';
import {IAccount, IAccountData, IPreparedFields} from './Models/Account';
import {ADDITIONAL_FIELDS, DEFAULT_FIELDS, SORT_ORDER} from './Store/Consts';
import {ILastUpdate} from './Models/Models';

/**
 * Функция, осуществляющая группировку полей по типам.
 *
 * @param fields Переданные поля.
 */
export const getPreparedAccountField = (fields: IAccountData) => {
    const prepareFields: IPreparedFields = {
        default: [],
        additional: [],
        custom: [],
    };

    return Object.keys(fields)
        .sort((a, b) => (SORT_ORDER[a] < SORT_ORDER[b] ? -1 : 1))
        .reduce((acc, field): IPreparedFields => {
            if (fields[field]) {
                if (~DEFAULT_FIELDS.indexOf(field)) {
                    acc.default.push(field);
                } else if (~ADDITIONAL_FIELDS.indexOf(field)) {
                    acc.additional.push(field);
                } else if (field !== 'password') {
                    acc.custom.push(field);
                }
            }

            return acc;
        }, prepareFields);
};

/**
 * Получает локализированную временную пару период/количество.
 *
 * @param locale Языковая локаль.
 * @param time Время.
 */
export const getLocaleLastUpdate = (locale: ELanguage, time: string): ILastUpdate => {
    const days = (Date.now() - new Date(time).valueOf()) / 86400000;

    const count = days < 30 ? days : days >= 30 && days < 365 ? days / 30 : days / 365;

    const period =
        days < 1
            ? EPluralPeriod.TODAY
            : days >= 1 && days < 30
            ? EPluralPeriod.DAY
            : days >= 30 && days < 365
            ? EPluralPeriod.MONTH
            : EPluralPeriod.YEAR;

    return {period: getLocalePluralPeriod(locale, period, count), count: Number(count.toFixed(2))};
};

/**
 * TODO.PERFORMANCE потенциально дорогая штука, используемая сразу в двух геттерах. Продумать как можно оптимизировать.
 * Утилитарная функция, принимающая массив аккаунтов, и возвращающая список содержащихся в них подкатегорий в
 * отсортированном виде.
 *
 * @param accounts Переданный список аккаунтов.
 */
export const getSortedSubcategoriesFromAccounts = (accounts: IAccount[]): string[] =>
    accounts
        .reduce((subcategories: string[], account: IAccount) => {
            account.subcategory && !subcategories.includes(account.subcategory) && subcategories.push(account.subcategory);
            return subcategories;
        }, [])
        .sort((a, b) => (a < b ? -1 : 1));
