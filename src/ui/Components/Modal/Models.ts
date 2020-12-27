import {EModalContentPosition} from './Enums';
import {ESizes} from 'ui/Common/Enums';

/**
 * Модель модального окна.
 *
 * @prop isOpen Флаг показа модального окна.
 * @prop onClose Обработчик закрытия модального окна.
 * @prop [className] css класс.
 * @prop [size] Размерности модального окна. Устанавливает max-width.
 */
export interface IModal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    size?: ESizes;
}

/**
 * Общая модель для контентных компонентов модального окна.
 *
 * @prop [className] CSS класс.
 */
export interface ICommonProps {
    className?: string;
}

/**
 * Модель свойства позиционирования в контентном компоненте.
 *
 * @prop [contentPosition] Позиция контента ВНУТРИ компонента. Реализован на justify-content|flex. API аналогичное.
 */
export interface IPosition {
    contentPosition?: EModalContentPosition;
}

/**
 * Модель для контентного компонента модального окна - Header.
 *
 * @prop onClose Обработчик закрытия модального окна.
 */
export interface IModalHeader extends ICommonProps, IPosition {
    onClose: () => void;
}

/**
 * Модель для контентного компонента модального окна - Footer.
 */
export interface IModalFooter extends ICommonProps, IPosition {}
