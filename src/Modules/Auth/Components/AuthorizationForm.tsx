import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';
import {MAIN_ROUTE_NAMES} from 'Modules/Main/Router/Routes';
import {SETTINGS_ROUTE_NAMES} from 'Modules/Settings/Router/Routes';
import {useIntl} from 'react-intl';
import {useSettings} from 'Modules/Settings/Store/Hooks';
import {observer} from 'mobx-react';

export const AuthorizationForm: FunctionComponent = observer(() => {
    const {formatMessage} = useIntl();
    const settings = useSettings();

    return (
        <div>
            <Link to={AUTH_ROUTE_NAMES.CHANGE_PASSWORD} className="change-master-key">
                GO TO ChangeMasterKey
            </Link>
            <button onClick={settings.setLanguage}>switch language</button>
            <div>
                <div>PassMan {formatMessage({id: 'AUTH__PAGE_NAME'})}</div>
                <br />
                <Link to={MAIN_ROUTE_NAMES.ROOT}>GO TO MAIN</Link>
                <br />
                <br />
                <Link to={SETTINGS_ROUTE_NAMES.ROOT}>GO TO SETTINGS</Link>
            </div>
        </div>
    );
});
