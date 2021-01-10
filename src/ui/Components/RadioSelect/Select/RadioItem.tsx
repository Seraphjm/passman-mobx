import {FunctionComponent} from 'react';
import classNames from 'classnames';
import './RadioItem.style.scss';

/**
 * Свойства item-Компонента радиоселектора типа кнопок.
 *
 * @prop [name] Служебное свойство, необходимое для задания name space для radio-selector.
 * @prop [isActive] Служебное свойство, необходимое для отметки активности при управляемом режиме работы.
 * @prop [className] css класс.
 * @prop [disabled] Флаг disabled.
 * @prop value Значение текущего элемента, уходящее в radio-selector.
 */
interface IRadioItem {
    name?: never;
    isActive?: never;
    className?: string;
    disabled?: boolean;
    value: string | number;
}

/**
 * item-Компонент радиоселектора.
 */
export const RadioItem: FunctionComponent<IRadioItem> = (props) => (
    <label className={classNames('ui-lib-radio-item', props.className)}>
        <input
            name={props.name}
            type="radio"
            defaultChecked={props.isActive}
            className="ui-lib__hidden-controller"
            disabled={props.disabled}
            value={props.value}
        />
        <span className="ui-lib-radio-item__ripple" />
        <span className="ui-lib-radio-item__label">{props.children}</span>
    </label>
);
