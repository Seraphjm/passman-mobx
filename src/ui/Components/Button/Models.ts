import {ESizes, EPositions, EColors} from 'ui/Common/Enums';

/**
 * Модель свойств состояния компонента кнопки.
 *
 * @prop [size] Размерности кнопки.
 * @prop [iconPos] Позиция иконки.
 * @prop [type] Цветовая схема кнопки по типу сообщения.
 * @prop [className] css класс переданный в компонент.
 * @prop [disabled] Флаг disabled.
 * @prop [onClick] Обработчик события onClick.
 * @prop [icon] Иконка.
 * @prop [additionalContent] Дополнительный встраиваемый контент рядом с children.
 * @prop [animate] Запуск анимации кнопки.
 */
export interface IButton {
    size?: ESizes;
    iconPos?: EPositions;
    type?: EColors;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    icon?: JSX.Element;
    additionalContent?: JSX.Element;
    animate?: boolean;
}
