import {FunctionComponent} from 'react';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import {SVGIcon} from 'ui';
import './Checkbox.style.scss';

/**
 * Свойства компонента checkbox.
 *
 * @prop [classNames] css класс.
 * @prop [disabled] Флаг disabled.
 * @prop [checked] Свойство, управляющее чекбоксом.
 */
interface ICheckbox {
    classNames?: string;
    disabled?: boolean;
    checked?: boolean;
}

/**
 * Компонент checkbox.
 */
export const Checkbox: FunctionComponent<ICheckbox> = (props) => (
    <label className={classNames('ui-lib-checkbox', props.classNames, {disabled: props.disabled})}>
        <input type="checkbox" className="ui-lib__hidden-controller" defaultChecked={props.checked} disabled={props.disabled} />
        <div className="ui-lib-checkbox__icon">
            <SVGIcon icon={faCheck} />
        </div>
        <div className="ui-lib-checkbox__label">{props.children}</div>
    </label>
);
