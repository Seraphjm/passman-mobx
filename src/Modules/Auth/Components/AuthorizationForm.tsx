import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';

export const AuthorizationForm: FunctionComponent = () => (
    <div>
        <Link to={AUTH_ROUTE_NAMES.CHANGE_PASSWORD} className="change-master-key">
            GO TO ChangeMasterKey
        </Link>
        <div>PassMan AUTH</div>
    </div>
);
