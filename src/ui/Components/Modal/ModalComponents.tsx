import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {isFunction} from 'ui/Utils';
import {ICommonProps, IModalFooter, IModalHeader} from './Models';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {SVGIcon} from 'ui/Components/Icon';
import {ESizes} from 'ui/Common/Enums';
import './ModalComponents.style.scss';

/**
 * Контентный компонет модального окна Header.
 */
export const ModalHeader: FunctionComponent<IModalHeader> = (props) => (
    <div className={classNames('ui-lib-modal__header', props.className)}>
        <span className={classNames('ui-lib-modal__header_content', props.contentPosition)}>{props.children}</span>
        {isFunction(props.onClose) && (
            <span onClick={props.onClose} className="ui-lib-modal__header_close">
                <SVGIcon size={ESizes.SM} icon={faTimes} />
            </span>
        )}
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
