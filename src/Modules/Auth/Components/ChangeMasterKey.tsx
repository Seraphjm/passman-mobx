import React, {FunctionComponent} from 'react';
import '../Pages/Authorization.style.scss';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';

const ChangeMasterKey: FunctionComponent = () => (
    <div>
        <Link to={AUTH_ROUTE_NAMES.ENTER_PASSWORD} className="change-master-key">
            GO TO Authorization
        </Link>
        <div>ChangeMasterKey</div>
    </div>
);

export default ChangeMasterKey;
