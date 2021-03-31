import {BaseSyntheticEvent, FunctionComponent, useState} from 'react';
import {redirectTo} from 'Router/Utils';
import {SETTINGS_ROUTE_NAMES} from 'Modules/Settings/Router/Routes';
import {faCog, faSearch} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {ESizes, SVGIcon} from 'ui';
import {observer} from 'mobx-react';
import {useMainStore} from '../../../../Store/Hooks';
import './ApplicationManagerPanel.style.scss';

/**
 * Панель управления приложением. От открытия настроек до расширенных глобальных фич с аккаунтами.
 */
export const ApplicationManagerPanel: FunctionComponent = observer(() => {
    /** mobx main store */
    const main = useMainStore();
    /** Состояние активности поиска*/
    const [searchEnabled, setSearchEnabled] = useState(false);
    /** ID элемента поиска. Необходимо для установки автофокуса. */
    const searchElementId = 'main.search';
    /** Функция, открывающая страницу настроек приложения */
    const openSettings = () => {
        redirectTo(SETTINGS_ROUTE_NAMES.ROOT);
    };

    /** Функция, передающая значение инпута в поиск */
    const onSearchInput = (e: BaseSyntheticEvent): void => {
        main.setSearch(e.target.value);
    };

    /** Функция, активирующая поиск по аккаунтам */
    const searchActivate = () => {
        document.getElementById(searchElementId)?.focus();
    };

    /** Функция, обрабатывающая потерю фокуса из поисковой строки */
    const searchOnBlur = () => {};

    return (
        <ul className="header__control-tools">
            <li onClick={searchActivate} className="header__icon header__item">
                <div className="header__search-container">
                    <input
                        id={searchElementId}
                        onInput={onSearchInput}
                        className="header__search-controller"
                        value={main.search}
                        onBlur={searchOnBlur}
                    />
                    <SVGIcon icon={faSearch} className="header__search-icon" size={ESizes.SM} />
                </div>
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
