import {FunctionComponent} from 'react';
import {Accounts} from './HeaderControl/Components/Accounts';
import {Tools} from './HeaderControl/Components/Tools';
import './Header.style.scss';

export const Header: FunctionComponent = () => (
    <div className="header">
        <Accounts />
        <Tools />
    </div>
);
