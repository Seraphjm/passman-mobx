import {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import {observer} from 'mobx-react';
import {useMain} from '../Store/Hooks';

/**
 * Главная страница приложения, предоставляющая его основной функционал.
 */
const Main: FunctionComponent = observer(() => {
    const main = useMain();
    return (
        <div id="main">
            <br />
            <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Auth</Link>
            <ul>
                {main.accounts.map((account) => (
                    <li>{account.accountName}</li>
                ))}
            </ul>
        </div>
    );
});

export default Main;
