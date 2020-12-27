import {FunctionComponent, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Button, ESizes, Input, Modal, ModalBody, ModalFooter, ModalHeader, Select, Option} from 'ui';
import {useIntl} from 'react-intl';
import {IModal} from 'ui/Components/Modal/Models';
import {useMain} from '../../../../Store/Hooks';

export const AddAccountModal: FunctionComponent<IModal> = observer(({onClose, isOpen}) => {
    const {accountPrototype, setFieldAccountPrototype, resetAccountPrototype} = useMain();
    const {formatMessage} = useIntl();

    useEffect(() => {
        return resetAccountPrototype;
    }, []);

    useEffect(() => {
        !isOpen && resetAccountPrototype();
    }, [isOpen]);

    const set = (v: string) => {
        setFieldAccountPrototype('data.login', v);
    };

    const setCategory = (v: string) => {
        setFieldAccountPrototype('category', v);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={ESizes.MD}>
            <ModalHeader onClose={onClose}>{formatMessage({id: 'MAIN__MODAL_ADD_FORM_NAME'})}</ModalHeader>
            <ModalBody>
                <Select onChange={setCategory} value={accountPrototype.category} placeholder="select value">
                    <Option value={'Наташа'}>Наташа</Option>
                    <Option value={'Антон'}>Антон</Option>
                    <Option value={'Сергей'}>Сергей</Option>
                    <Option value={'Валера'}>Валера</Option>
                    <Option value={'Константин'}>Константин</Option>
                </Select>
                <div>{formatMessage({id: 'MAIN__MODAL_ADD_SELECT_SOME_ITEM'})}</div>

                {accountPrototype.category && (
                    <div className="account-form">
                        <Input value={accountPrototype.data.login} onInput={set} />

                        <div className="additional-template">
                            <div>PASSGEN: {accountPrototype.data.password}</div>
                            <textarea />
                        </div>

                        <div>SET ICONS</div>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button icon="fas fa-download">{formatMessage({id: 'MAIN__MODAL_ADD_ACTION_ADD_ACCOUNT'})}</Button>
            </ModalFooter>
        </Modal>
    );
});
