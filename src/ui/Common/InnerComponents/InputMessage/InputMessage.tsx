import {FunctionComponent} from 'react';
import './InputMessage.style.scss';

/**
 * Компонент нотификаций для элементов ввода.
 * Для внутреннего использования. Инкапсулирует стили на уровне компонента.
 */
export const InputMessage: FunctionComponent = (props) => <div className="ui-lib__input-message font-monospace">{props.children}</div>;
