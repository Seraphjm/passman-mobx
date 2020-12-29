import {IEventMessage} from 'ui/Common/Models';

/**
 * Модель элемента автокомплита.
 *
 * @prop isActive Флаг активного элемента.
 * @prop index Текущий индекс элемента.
 * @prop [value] Значение элемента.
 */
export interface ICompleteItem {
    isActive: boolean;
    index: number;
    value?: string;
}

/**
 * Модель элемента автокомплита.
 *
 * @prop isOpen Флаг отображения контейнера для автокомплита.
 * @prop selectedItem Выбранный элемент из списка.
 * @prop value Искомое значение.
 * @prop autoComplete Список элементов для автокомплита.
 * @prop [style] Ширина контейнера.
 * @prop setMouseSelected Функция устанавливающее выбранное значение по ховеру мыши.
 */
export interface IAutoComplete {
    isOpen: boolean;
    selectedItem: number | null;
    value: string;
    autoComplete: string[];
    style?: any;
    setMouseSelected: (v: number | null) => void;
}

/**
 * Модель инпута.
 *
 * @prop value Значение инпута.
 * @prop onInput Функция установки значения в value.
 * @prop [message] Сообщение прикреплённое к полю инпута.
 * @prop [autoComplete] Список элементов для автокомплита по введёному значению.
 * @prop [placeholder] placeholder для инпута.
 * @prop [disabled] Флаг disabled на инпут.
 * @prop [autoFocus] Флаг автофокуса.
 * @prop [onEnter] Функция обработки нажатия клавиши Enter. В параметре будет значение инпута.
 * @prop [type] Тип инпута.
 * @prop [required] Флаг обязательности заполнения инпута.
 * @prop [className] CSS класс для контейнера инпута.
 * @prop [onFocus] Функция обрабатывающая фокус инпута.
 * @prop [onFocus] Функция обрабатывающая потерю фокуса инпута.
 * @prop [onKeyUp] Функция обрабатывающая onKeyUp инпута.
 * @prop [onKeyDown] Функция обрабатывающая onKeyDown инпута.
 * @prop [inputRef] Ref на элемент инпута.
 * @prop [dataBind] Прикреплённые данные к инпуту, которые будет переданны в onInput вторым параметром.
 */
export interface IInput<T = unknown> {
    value: string;
    onInput: (value: string, bindData?: T | any) => void; // TODO.TYPES
    message?: IEventMessage;
    autoComplete?: string[];
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    onEnter?: (value: string) => void;
    type?: string;
    required?: boolean;
    className?: string;
    onFocus?: (event: unknown) => void;
    onBlur?: (event: unknown) => void;
    onKeyUp?: (event: unknown) => void;
    onKeyDown?: (event: unknown) => void;
    inputRef?: any;
    dataBind?: T;
}
