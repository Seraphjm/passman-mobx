import {BaseSyntheticEvent, FunctionComponent} from 'react';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import {EColors, SVGIcon} from 'ui';
import {isFunction} from 'ui/Utils';
import './Switch.style.scss';

/**
 * Свойства компонента Switch.
 *
 * @prop [classNames] css класс.
 * @prop [disabled] Флаг disabled.
 * @prop [checked] Свойство, управляющее чекбоксом.
 * @prop [onChange] Обработчик события onChange.
 */
interface ISwitch {
    classNames?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange?: (v: boolean) => void;
}

/**
 * Компонент checkbox.
 */
export const Switch: FunctionComponent<ISwitch> = (props) => {
    const onChange = (e: BaseSyntheticEvent) => {
        // @ts-ignore ложноположительное срабатывание
        isFunction(props.onChange) && props.onChange(e.target.checked);
    };

    return (
        <label className={classNames('ui-lib-switch', props.classNames)}>
            <input
                onChange={onChange}
                checked={props.checked}
                type="checkbox"
                className="ui-lib__hidden-controller"
                disabled={props.disabled}
            />
            <div className="ui-lib-switch__icon">
                <SVGIcon color={EColors.SECONDARY} icon={faCircle} />
            </div>
            <div className="ui-lib-switch__label">{props.children}</div>
        </label>
    );
};
