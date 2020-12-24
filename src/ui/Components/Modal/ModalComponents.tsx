import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {EModalContentPosition} from './Enums';
import {isFunction} from 'ui/Utils';
import './ModalComponents.style.scss';

/**
 * Общая модель для контентных компонентов модального окна.
 *
 * @prop [contentPosition] Позиция контента ВНУТРИ компонента. Реализован на justify-content|flex. API аналогичное.
 * @prop [className] CSS класс.
 */
interface IProps {
    contentPosition?: EModalContentPosition;
    className?: string;
}

/**
 * Дополненная модель для контентного компонента модального окна - Header.
 *
 * @prop onClose Обработчик закрытия модального окна.
 */
interface IModalHeader extends IProps {
    onClose: () => void;
}

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
export const ModalBody: FunctionComponent<IProps> = (props) => (
    <div className={classNames('ui-lib-modal__body', props.contentPosition, props.className)}>{props.children}</div>
);

/**
 * Контентный компонет модального окна Footer.
 */
export const ModalFooter: FunctionComponent<IProps> = (props) => (
    <div className={classNames('ui-lib-modal__footer', props.contentPosition, props.className)}>{props.children}</div>
);
