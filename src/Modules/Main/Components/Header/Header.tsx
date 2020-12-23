import {FunctionComponent} from 'react';
import {HeaderControl} from './HeaderControl';
import './Header.style.scss';

export const Header: FunctionComponent = () => (
    <div className="header">
        <HeaderControl />
    </div>
);
