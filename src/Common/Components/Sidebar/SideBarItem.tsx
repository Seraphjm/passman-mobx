import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {ESizes} from 'ui';
import {SVGIcon} from 'ui/Components/Icon/index';
import {IIcon} from 'ui/Components/Icon/Models';
import './SideBarItem.style.scss';

/**
 * Модель элемента сайдбара.
 *
 * @prop active Флаг активности элемента.
 * @prop icon Иконка элемента.
 * @prop text Текст элемента.
 * @prop id Идентификатор элемента.
 */
interface ISideBarItem {
    active: boolean;
    icon: IIcon;
    text: string;
    id: string;
}

/**
 * Элемент сайдбара.
 */
export const SideBarItem: FunctionComponent<ISideBarItem> = (props) => (
    <li data-id={props.id} className={classNames('sidebar-item', {'sidebar-item--active': props.active})}>
        <SVGIcon size={ESizes.LG} icon={props.icon} className="sidebar-item__icon" />
        <span className="sidebar-item__text">{props.text}</span>
    </li>
);
