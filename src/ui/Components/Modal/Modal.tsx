import {FunctionComponent} from 'react';
import {ModalPortal} from './Modal.portal';
import classNames from 'classnames';
import {ESizes} from 'ui/Common/Enums';
import './Modal.style.scss';

/**
 * Модель модального окна.
 *
 * @prop isOpen Флаг показа модального окна.
 * @prop onClose Обработчик закрытия модального окна.
 * @prop [className] css класс.
 * @prop [size] Размерности модального окна. Устанавливает max-width.
 */
interface IModal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    size?: ESizes;
}

/**
 * Компонент модального окна.
 */
export const Modal: FunctionComponent<IModal> = (props) => (
    <ModalPortal>
        {props.isOpen ? (
            <div className={classNames('ui-lib-modal', props.className)}>
                <div onClick={props.onClose} className="ui-lib-modal__background" />
                <div className={classNames('ui-lib-modal__container', props.size)}>{props.children}</div>
            </div>
        ) : null}
    </ModalPortal>
);
