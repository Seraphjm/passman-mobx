import {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';

const Settings: FunctionComponent = () => (
    <div>
        <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Authorization</Link>
        <div>SETTINGS</div>
    </div>
);

export default Settings;
