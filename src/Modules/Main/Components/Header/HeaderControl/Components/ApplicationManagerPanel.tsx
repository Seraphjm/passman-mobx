import {FunctionComponent} from 'react';
import {redirectTo} from 'Router/Utils';
import {SETTINGS_ROUTE_NAMES} from 'Modules/Settings/Router/Routes';
import {faCog, faSearch} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {ESizes, SVGIcon} from 'ui';
import {observer} from 'mobx-react';

/**
 * Панель управления приложением. От открытия настроек до расширенных глобальных фич с аккаунтами.
 */
export const ApplicationManagerPanel: FunctionComponent = observer(() => {
    const openSettings = () => {
        redirectTo(SETTINGS_ROUTE_NAMES.ROOT);
    };

    return (
        <ul className="header__control-tools">
            <li className="header__icon header__item">
                <SVGIcon icon={faSearch} size={ESizes.SM} />
            </li>
            <li className="header__icon header__item">
                <SVGIcon icon={faQuestionCircle} size={ESizes.SM} />
            </li>
            <li onClick={openSettings} className="header__icon header__item">
                <SVGIcon icon={faCog} size={ESizes.SM} />
            </li>
        </ul>
    );
});
