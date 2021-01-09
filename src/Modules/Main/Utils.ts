import {IAccountData, IPreparedFields} from './Models/Account';
import {ADDITIONAL_FIELDS, DEFAULT_FIELDS, SORT_ORDER} from './Store/Consts';

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
