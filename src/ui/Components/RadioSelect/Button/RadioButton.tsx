import {FunctionComponent, useRef, useState} from 'react';
import classNames from 'classnames';
import {IRipplePosition, TRippleMouseEvent} from 'ui/Common/Models';
import {calcRipplePosition, uuid} from 'ui/Utils';
import './RadioButton.style.scss';

/**
 * Свойства item-Компонента радиоселектора типа кнопок.
 *
 * @prop [name] Служебное свойство, необходимое для задания name space для radio-selector.
 * @prop [isActive] Служебное свойство, необходимое для отметки активности при управляемом режиме работы.
 * @prop [className] css класс.
 * @prop [disabled] Флаг disabled.
 * @prop value Значение текущего элемента, уходящее в radio-selector.
 */
interface IRadioItemButton {
    name?: never;
    isActive?: never;
    className?: string;
    disabled?: boolean;
    value: string | number;
}

/**
 * item-Компонент радиоселектора типа кнопки.
 */
export const RadioButton: FunctionComponent<IRadioItemButton> = (props) => {
    const {current: id} = useRef(uuid());
    const [ripple, setRipple] = useState<IRipplePosition | {}>({});

    /**
     * Обработчик отрисовки ripple.
     */
    const onClickHandler = async (e: TRippleMouseEvent): Promise<void> => {
        e.stopPropagation();

        await setRipple({...ripple, display: 'none'});
        const style = await calcRipplePosition(e);
        setRipple({...style, display: 'initial'});
    };

    return (
        <div className={classNames('ui-lib-radio-button', props.className)}>
            <input
                id={id}
                name={props.name}
                type="radio"
                className="ui-lib__hidden-controller"
                disabled={props.disabled}
                defaultChecked={props.isActive}
                value={props.value}
            />
            <label
                onClick={onClickHandler}
                className={classNames('ui-lib-radio-button__container', {disabled: props.disabled})}
                htmlFor={id}
            >
                <span className="ui-lib__ripple" style={ripple} />
                <span className="ui-lib-radio-button__label">{props.children}</span>
            </label>
        </div>
    );
};
