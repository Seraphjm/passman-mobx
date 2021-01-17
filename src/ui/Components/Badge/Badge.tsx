import {FunctionComponent} from 'react';
import {IBadge} from './Models';
import './Badge.style.scss';

/**
 * ui компонент Badge.
 */
export const Badge: FunctionComponent<IBadge> = (props) => <div className="ui-lib-badge">{props.children}</div>;
