import {BaseSyntheticEvent, Children, cloneElement, FunctionComponent, useRef} from 'react';
import classNames from 'classnames';
import {ESizes} from 'ui/Common/Enums';
import {uuid, isFunction} from 'ui/Utils';
import './RadioSelectButton.style.scss';

/**
 * Свойства компонента radio-select.
 *
 * @prop [size] Размерности компонента.
 * @prop [className] css класс.
 * @prop [onChange] Обработчик события onChange.
 * @prop [value] Значение компонента для его контроля из вне.
 */
interface IRadioButton<T extends string | number> {
    size?: ESizes;
    className?: string;
    onChange?: (e: T) => void;
    value?: string | number;
}

// TODO.TYPES дженерик IRadioButton в FunctionComponent
/**
 * Компонент radio-select в форме кнопок.
 */
export const RadioSelectButton: FunctionComponent<IRadioButton<any>> = (props) => {
    /** Создание name space для radio-select */
    const {current: name} = useRef(uuid());

    /**
     * Обработчик события изменения состояния radio-select.
     *
     * @param e event.
     */
    const onChange = (e: BaseSyntheticEvent) => {
        // @ts-ignore ложноположительное срабатывание.
        isFunction(props.onChange) && props.onChange(e.target.value as string | number);
    };

    return (
        <div onChange={onChange} className={classNames('ui-lib-radio-select-button', props.className, props.size)}>
            {Children.map<any, any>(props.children, (child) =>
                cloneElement(child, {
                    name,
                    isActive: props.value !== undefined ? props.value === child.props.value : undefined,
                })
            )}
        </div>
    );
};
