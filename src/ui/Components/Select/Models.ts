import {IEventMessage} from '../../Common/Models';

/**
 * Модель компонента select.
 *
 * @prop [value] Текущее значение компонента select.
 * @prop [onChange] Обработчик изменения текущего значения компонента.
 * @prop [className] css класс.
 * @prop [placeholder] placeholder.
 * @prop [required] Флаг обязательности заполнения.
 * @prop [message] Сообщение для вывода информации в компонент.
 */
export interface ISelect<T = unknown> {
    value: string;
    onChange: (v: T) => void;
    className?: string;
    placeholder?: string;
    required?: boolean;
    message?: IEventMessage;
}

/**
 * Модель компонента option.
 *
 * @prop [index] Служебное свойство, необходимое для извлечения значения из списка.
 * @prop [search] Служебное свойство. Необходимо для подсветки при поиске.
 * @prop [active] Служебное свойство. Необходимо для подсветки активного элемента клавишами навигации.
 * @prop value Значение переданное в option.
 * @prop [icon] Иконка переданная в option. TODO.any
 */
export interface IOption<T = unknown> {
    index?: never;
    search?: never;
    active?: never;
    value: T;
    icon?: any;
}
