import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {EModalContentPosition} from './Enums';
import {isFunction} from 'ui/Utils';
import './ModalComponents.style.scss';

/**
 * Общая модель для контентных компонентов модального окна.
 *
 * @prop [className] CSS класс.
 */
interface ICommonProps {
    className?: string;
}

/**
 * Модель свойства позиционирования в контентном компоненте.
 *
 * @prop [contentPosition] Позиция контента ВНУТРИ компонента. Реализован на justify-content|flex. API аналогичное.
 */
interface IPosition {
    contentPosition?: EModalContentPosition;
}

/**
 * Модель для контентного компонента модального окна - Header.
 *
 * @prop onClose Обработчик закрытия модального окна.
 */
interface IModalHeader extends ICommonProps, IPosition {
    onClose: () => void;
}

/**
 * Модель для контентного компонента модального окна - Footer.
 */
interface IModalFooter extends ICommonProps, IPosition {}

/**
 * Контентный компонет модального окна Header.
 */
export const ModalHeader: FunctionComponent<IModalHeader> = (props) => (
    <div className={classNames('ui-lib-modal__header', props.className)}>
        <span className={classNames('ui-lib-modal__header_content', props.contentPosition)}>{props.children}</span>
        {isFunction(props.onClose) && <span onClick={props.onClose} className="ui-lib-modal__header_close fas fa-times" />}
    </div>
);

/**
 * Контентный компонет модального окна Body.
 */
export const ModalBody: FunctionComponent<ICommonProps> = (props) => (
    <div className={classNames('ui-lib-modal__body', props.className)}>{props.children}</div>
);

/**
 * Контентный компонет модального окна Footer.
 */
export const ModalFooter: FunctionComponent<IModalFooter> = (props) => (
    <div className={classNames('ui-lib-modal__footer', props.contentPosition, props.className)}>{props.children}</div>
);
