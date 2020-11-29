import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';

const Main: FunctionComponent = () => (
    <div id="main">
        MAIN
        <br />
        <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Auth</Link>
    </div>
);

export default Main;
