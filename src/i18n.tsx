import React, {FunctionComponent, useEffect, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {ELanguages} from 'Common/Locales/Enums';
import {observer} from 'mobx-react';
import {useSettings} from 'Modules/Settings/Store/Hooks';

interface IMessagesExportModule {
    default: Record<string, string> | Record<string, unknown[]>;
}

function loadLocaleData(locale: ELanguages): Promise<IMessagesExportModule> {
    return import(
        /* webpackMode: "lazy" */
        `./Assets/locales/${locale}.json`
    );
}

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
            onError={(err: any) => console.log(err)}
            formats={{}}
            defaultFormats={{}}
            locale={settings.language}
            defaultLocale={ELanguages.en_US}
            messages={messages}
        >
            {children}
        </IntlProvider>
    );
});
