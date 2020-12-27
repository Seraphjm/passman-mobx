import {FunctionComponent} from 'react';
import classNames from 'classnames';
import './InputPlaceholder.style.scss';

/**
 * Модель компонента плейсхолдера.
 */
interface IInputPlaceholder {
    required?: boolean;
}

/**
 * Компонент плейсхолдера для элементов ввода.
 * Для внутреннего использования. Инкапсулирует стили на уровне компонента.
 */
export const InputPlaceholder: FunctionComponent<IInputPlaceholder> = (props) => (
    <div className={classNames('ui-lib__input-placeholder', 'text-ellipsis', {required: props.required})}>{props.children}</div>
);
