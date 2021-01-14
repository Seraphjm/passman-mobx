import {BaseSyntheticEvent, FunctionComponent} from 'react';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import {SVGIcon} from 'ui';
import {isFunction} from 'ui/Utils';
import './Checkbox.style.scss';

/**
 * Свойства компонента checkbox.
 *
 * @prop [classNames] css класс.
 * @prop [disabled] Флаг disabled.
 * @prop [checked] Свойство, управляющее чекбоксом.
 * @prop [onChange] Обработчик события onChange.
 */
interface ICheckbox {
    classNames?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange?: (v: boolean) => void;
}

/**
 * Компонент checkbox.
 */
export const Checkbox: FunctionComponent<ICheckbox> = (props) => {
    const onChange = (e: BaseSyntheticEvent) => {
        // @ts-ignore ложноположительное срабатывание
        isFunction(props.onChange) && props.onChange(e.target.checked);
    };

    return (
        <label className={classNames('ui-lib-checkbox', props.classNames)}>
            <input
                onChange={onChange}
                checked={props.checked}
                type="checkbox"
                className="ui-lib__hidden-controller"
                disabled={props.disabled}
            />
            <div className="ui-lib-checkbox__icon">
                <SVGIcon icon={faCheck} />
            </div>
            <div className="ui-lib-checkbox__label">{props.children}</div>
        </label>
    );
};
