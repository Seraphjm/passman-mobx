import {BaseSyntheticEvent, FunctionComponent, useRef} from 'react';
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
    /** Реф на инпут элемент поиска. Необходимо для установки фокуса */
    const searchElement = useRef<HTMLInputElement>();
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
        searchElement.current?.focus();
    };

    return (
        <ul className="header__control-tools">
            <li onClick={searchActivate} className="header__icon header__item">
                <div className="header__search-container">
                    <input
                        // @ts-ignore
                        ref={searchElement}
                        onInput={onSearchInput}
                        className="header__search-controller"
                        value={main.search}
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
