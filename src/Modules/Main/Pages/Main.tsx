import {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import {FormattedMessage} from 'react-intl';

const Main: FunctionComponent = () => (
    <div id="main">
        <FormattedMessage id="AUTH">{(t) => t}</FormattedMessage>
        <br />
        <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Auth</Link>
    </div>
);

export default Main;
