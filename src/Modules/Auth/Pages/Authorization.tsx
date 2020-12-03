import React, {FunctionComponent, useRef} from 'react';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';
import {Link, useLocation} from 'react-router-dom';
import {useIntl} from 'react-intl';
import './Authorization.style.scss';

interface ILocationMap {
    [key: string]: {translation: string; to: string};
}

/**
 * Страница авторизации. Точка входа пользователя.
 */
export const AuthorizationPage: FunctionComponent = ({children}) => {
    const {pathname} = useLocation();
    const {formatMessage} = useIntl();
    const {current} = useRef<ILocationMap>({
        [AUTH_ROUTE_NAMES.ENTER_PASSWORD]: {
            translation: 'AUTH__LINK_TO_CHANGE_MASTER_KEY',
            to: AUTH_ROUTE_NAMES.CHANGE_PASSWORD,
        },
        [AUTH_ROUTE_NAMES.CHANGE_PASSWORD]: {
            translation: 'AUTH__LINK_TO_ENTER_PASSWORD',
            to: AUTH_ROUTE_NAMES.ENTER_PASSWORD,
        },
    });
    const currentMap = current[pathname];

    return (
        <div id="authorization" className="v-center">
            <Link to={currentMap.to} className="change-master-key">
                {formatMessage({id: currentMap.translation})}
            </Link>
            {children}
        </div>
    );
};
