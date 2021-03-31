import {FunctionComponent, useEffect, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {ELanguage} from 'Modules/Settings/Enums';
import {observer} from 'mobx-react';
import {useSettingsStore} from 'Modules/Settings/Store/Hooks';

/**
 * Модель экспортируемого модуля локализации.
 *
 * @prop default Экспортируемый модуль локализации.
 */
interface IMessagesExportModule {
    default: Record<string, string> | Record<string, unknown[]>;
}

/**
 * Динамически подтягивает бандлы с локализацией.
 *
 * @param locale Выбранная локализация для подгрузки.
 */
function loadLocaleData(locale: ELanguage): Promise<IMessagesExportModule> {
    return import(
        /* webpackMode: "lazy" */
        `./Assets/locales/${locale}.json`
    );
}

/**
 * Враппер для IntlProvider, необходимый для ленивой загрузки локализаций i18n.
 */
export const IntlWrapper: FunctionComponent = observer(({children}) => {
    const [messages, setMessages] = useState<any>({default: null});
    const settings = useSettingsStore();

    useEffect(() => {
        loadLocaleData(settings.language)
            .then(setMessages)
            .catch((err) => console.error(err));
    }, [settings.language]);

    if (!messages.default) return null;

    return (
        <IntlProvider
            onError={(err: any) => console.error(err)}
            formats={{}}
            defaultFormats={{}}
            locale={settings.language}
            defaultLocale={ELanguage.en_US}
            messages={messages}
        >
            {children}
        </IntlProvider>
    );
});

/**
 * Перечисление числительных по времени.
 */
export enum EPluralPeriod {
    TODAY = 'TODAY',
    DAY = 'DAY',
    MONTH = 'MONTH',
    YEAR = 'YEAR',
}

/**
 * Возвращает локализованное значение периода в соответствии с переданным числительным count.
 *
 * @param locale Текущая локализация.
 * @param period Временной период.
 * @param count Количественное числительное.
 */
export const getLocalePluralPeriod = (locale: ELanguage, period: EPluralPeriod, count: number): string => {
    let localePeriod = '';

    switch (locale) {
        case ELanguage.en_US:
            switch (period) {
                case EPluralPeriod.DAY:
                    localePeriod = count > 1 ? 'days' : 'day';
                    break;
                case EPluralPeriod.MONTH:
                    localePeriod = count > 1 ? 'month' : 'months';
                    break;
                case EPluralPeriod.YEAR:
                    localePeriod = count > 1 ? 'year' : 'years';
            }
            break;
        case ELanguage.ru_RU:
            const lastDigit = (count ^ 0) % 10;
            const lastTwoDigit = (count ^ 0) % 100;

            switch (period) {
                case EPluralPeriod.DAY:
                    if (lastTwoDigit < 10 || lastTwoDigit > 20) {
                        localePeriod = lastDigit <= 1 ? 'день' : lastDigit <= 4 ? 'дня' : 'дней';
                    } else {
                        localePeriod = 'дней';
                    }
                    break;
                case EPluralPeriod.MONTH:
                    if (lastTwoDigit < 10 || lastTwoDigit > 20) {
                        localePeriod = lastDigit <= 1 ? 'месяц' : lastDigit <= 4 ? 'месяца' : 'месяцев';
                    } else {
                        localePeriod = 'месяцев';
                    }
                    break;
                case EPluralPeriod.YEAR:
                    localePeriod = lastDigit <= 1 ? 'год' : lastDigit <= 4 ? 'года' : 'лет';
            }
            break;
    }

    return localePeriod;
};
