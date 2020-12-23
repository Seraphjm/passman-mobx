import {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import './Sidebar.style.scss';

export const SideBar: FunctionComponent = () => (
    <div className="sidebar">{process.env.NODE_ENV === 'development' && <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Auth</Link>}</div>
);
