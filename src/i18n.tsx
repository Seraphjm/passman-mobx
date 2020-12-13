import React, {FunctionComponent, useEffect, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {ELanguage} from 'Modules/Settings/Enums';
import {observer} from 'mobx-react';
import {useSettings} from 'Modules/Settings/Store/Hooks';

/**
 * Модель экспортируемого модуля локализации.
 */
interface IMessagesExportModule {
    default: Record<string, string> | Record<string, unknown[]>;
}

/**
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
    const settings = useSettings();

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
