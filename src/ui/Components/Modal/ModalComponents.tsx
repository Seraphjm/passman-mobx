import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {isFunction} from 'ui/Utils';
import {ICommonProps, IModalFooter, IModalHeader} from './Models';
import './ModalComponents.style.scss';

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
