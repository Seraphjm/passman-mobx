import {FunctionComponent} from 'react';
import {ModalPortal} from './Modal.portal';
import classNames from 'classnames';
import {IModal} from './Models';
import './Modal.style.scss';

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
