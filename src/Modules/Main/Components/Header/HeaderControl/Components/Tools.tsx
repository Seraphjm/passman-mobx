import {FunctionComponent} from 'react';
import {redirectTo} from 'Router/Utils';
import {SETTINGS_ROUTE_NAMES} from 'Modules/Settings/Router/Routes';

export const Tools: FunctionComponent = () => {
    const openSettings = () => {
        redirectTo(SETTINGS_ROUTE_NAMES.ROOT);
    };

    return (
        <ul className="header__control-tools">
            <li className="header__icon fas fa-search header__item" />
            <li className="header__icon header__item fa fa-question-circle" />
            <li onClick={openSettings} className="header__icon header__item fa fa-cog" />
        </ul>
    );
};
