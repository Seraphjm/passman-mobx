import {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {RadioButton, RadioSelectButton} from 'ui';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import {MAIN_ROUTE_NAMES} from 'Modules/Main/Router/Routes';
import {ELanguage} from '../Enums';
import {useSettingsStore} from '../Store/Hooks';
import './Settings.style.scss';

/**
 * Страница настроек приложения.
 */
const Settings: FunctionComponent = () => {
    const settings = useSettingsStore();
    return (
        <div className="settings">
            <div className="settings__sidebar">
                <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Authorization</Link>
                <br />
                <br />
                <Link to={MAIN_ROUTE_NAMES.ROOT}>GO TO MAIN</Link>
            </div>
            <div>
                <RadioSelectButton onChange={settings.setLanguage} value={settings.language}>
                    <RadioButton value={ELanguage.en_US}>English</RadioButton>
                    <RadioButton value={ELanguage.ru_RU}>Русский</RadioButton>
                </RadioSelectButton>
            </div>
        </div>
    );
};

export default Settings;
