import ReactDOM from 'react-dom';
import {FunctionComponent, useRef} from 'react';
import './Modal.style.scss';

/**
 * Реализация портала для модального окна.
 */
export const ModalPortal: FunctionComponent = ({children}) => {
    const container = useRef<HTMLElement | null>(document.getElementById('ui-lib-modal-portal'));
    return container?.current ? ReactDOM.createPortal(children, container.current) : null;
};
