import {FunctionComponent} from 'react';
import {AccountsControlPanel} from './HeaderControl/Components/AccountsControlPanel';
import {ApplicationManagerPanel} from './HeaderControl/Components/ApplicationManagerPanel';
import './Header.style.scss';

/**
 * Компонент header приложения. Здесь располагаются инструменты для управления аккаунтами и приложением.
 */
export const Header: FunctionComponent = () => (
    <div className="header">
        <AccountsControlPanel />
        <ApplicationManagerPanel />
    </div>
);
