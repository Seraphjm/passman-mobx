import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';
import {MAIN_ROUTE_NAMES} from 'Modules/Main/Router/Routes';
import {SETTINGS_ROUTE_NAMES} from 'Modules/Settings/Router/Routes';

export const AuthorizationForm: FunctionComponent = () => (
    <div>
        <Link to={AUTH_ROUTE_NAMES.CHANGE_PASSWORD} className="change-master-key">
            GO TO ChangeMasterKey
        </Link>
        <div>
            <div>PassMan AUTH</div>
            <br />
            <Link to={MAIN_ROUTE_NAMES.ROOT}>GO TO MAIN</Link>
            <br />
            <br />
            <Link to={SETTINGS_ROUTE_NAMES.ROOT}>GO TO SETTINGS</Link>
        </div>
    </div>
);
