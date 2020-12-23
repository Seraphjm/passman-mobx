import {FunctionComponent} from 'react';
import './HeaderControl.style.scss';

export const HeaderControl: FunctionComponent = () => (
    <div className="header__container">
        <ul className="header__control-accounts">
            <li className="header__icon fab fa-keycdn" />
            <li className="header__item">ADD</li>
            <li className="header__item">EDIT</li>
            <li className="header__item">MOVE</li>
            <li className="header__item">DELETE</li>
            <li className="header__item">CANCEL</li>
        </ul>
        <ul className="header__control-tools">
            <li className="header__icon fas fa-search header__item" />
            <li className="header__icon header__item fa fa-question-circle" />
            <li className="header__icon header__item fa fa-cog" />
        </ul>
    </div>
);
