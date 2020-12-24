import {FunctionComponent, useState} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'ui/index';

export const Accounts: FunctionComponent = () => {
    const [open, setOpen] = useState<boolean>(false);

    const click = () => {
        setOpen(true);
    };

    const closeHandler = () => setOpen(false);

    return (
        <>
            <ul className="header__control-accounts">
                <li className="header__icon fab fa-keycdn" />
                <li onClick={click} className="header__item">
                    ADD
                </li>
                <li className="header__item">EDIT</li>
                <li className="header__item">MOVE</li>
                <li className="header__item">DELETE</li>
                <li className="header__item">CANCEL</li>
            </ul>

            <Modal isOpen={open} onClose={closeHandler}>
                <ModalHeader onClose={closeHandler}>HEADER</ModalHeader>
                <ModalBody>BODY</ModalBody>
                <ModalFooter>FOOTER</ModalFooter>
            </Modal>
        </>
    );
};
