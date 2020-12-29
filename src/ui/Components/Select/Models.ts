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
 * @prop [dataBind] Прикреплённые данные к инпуту, которые будет переданны в onChange вторым параметром.
 */
export interface ISelect<T = unknown, B = unknown> {
    value: string;
    onChange: (v: T, dataBind?: B) => void;
    className?: string;
    placeholder?: string;
    required?: boolean;
    message?: IEventMessage;
    dataBind?: B;
}

/**
 * Модель компонента option.
 *
 * @prop [index] Служебное свойство, необходимое для извлечения значения из списка.
 * @prop [search] Служебное свойство. Необходимо для подсветки при поиске.
 * @prop [active] Служебное свойство. Необходимо для подсветки активного элемента клавишами навигации.
 * @prop value Значение переданное в option.
 * @prop [icon] Иконка переданная в option.
 */
export interface IOption<T = unknown> {
    index?: never;
    search?: never;
    active?: never;
    value: T;
    icon?: JSX.Element;
}
