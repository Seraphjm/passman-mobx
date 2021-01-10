import {BaseSyntheticEvent, Children, cloneElement, FunctionComponent, useRef} from 'react';
import classNames from 'classnames';
import {isFunction, uuid} from 'ui/Utils/index';
import {EOrientation} from 'ui/Common/Enums';
import './RadioSelect.style.scss';

/**
 * Свойства компонента radio-select.
 *
 * @prop [onChange] Обработчик события onChange.
 * @prop [value] Значение компонента для его контроля из вне.
 * @prop [className] css класс.
 * @prop [orientation] Ориентация комонента.
 */
interface IRadioSelect {
    onChange?: (e: string | number) => void;
    orientation?: EOrientation;
    className?: string;
    value?: string | number;
}

/**
 * Компонент radio-select.
 */
export const RadioSelect: FunctionComponent<IRadioSelect> = (props) => {
    /** Создание name space для radio-select */
    const {current: name} = useRef(uuid());
    const {orientation = EOrientation.HORIZONTAL} = props;

    /**
     * Обработчик события изменения состояния radio-select.
     *
     * @param e event.
     */
    const onChange = (e: BaseSyntheticEvent) => {
        // @ts-ignore ложноположительное срабатывание.
        isFunction(props.onChange) && props.onChange(e.target.value);
    };

    return (
        <div onChange={onChange} className={classNames('ui-lib-radio-select', orientation, props.className)}>
            {Children.map<any, any>(props.children, (child) =>
                cloneElement(child, {
                    name,
                    isActive: props.value !== undefined ? props.value === child.props.value : undefined,
                })
            )}
        </div>
    );
};
