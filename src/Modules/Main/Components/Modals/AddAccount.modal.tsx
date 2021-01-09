import {FunctionComponent, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Button, ESizes, Input, Modal, ModalBody, ModalFooter, ModalHeader, Option, Select, SVGIcon} from 'ui/index';
import {useIntl} from 'react-intl';
import {IModal} from 'ui/Components/Modal/Models';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {useMain} from '../../Store/Hooks';
import {IFieldsCategory} from '../../Store/Models';
import './AddAccount.style.scss';

/**
 * Компонент модального окна добавления нового аккаунта.
 */
export const AddAccountModal: FunctionComponent<IModal> = observer(({onClose, isOpen}) => {
    const main = useMain();
    const {formatMessage} = useIntl();
    // eslint-disable-next-line
    useEffect(main.resetAccountPrototype, []);

    useEffect(() => {
        !isOpen && main.resetAccountPrototype();
        // eslint-disable-next-line
    }, [isOpen]);

    /**
     * Метод установки значения в прототип нового аккаунта в свойство data.
     *
     * @param value Устанавливаемое значение.
     * @param field Поле в которое необходимо установить пришедшее значение.
     */
    const setField = (value: string, field: string): void => {
        const f = field === 'name' ? field : `data.${field}`;
        f && main.setFieldAccountPrototype(f, value);
    };

    /**
     * Метод, устанавливающий категорию аккаунта в его прототип.
     *
     * @param value Значение категории.
     */
    const setCategory = (value: string) => {
        main.setFieldAccountPrototype('category', value);
    };

    /**
     * Метод добавления нового аккаунта. Так же закрывает модальное окно.
     */
    const addAccount = () => {
        main.addAccount();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={ESizes.MD}>
            <ModalHeader onClose={onClose}>{formatMessage({id: 'MAIN__MODAL_ADD_FORM_NAME'})}</ModalHeader>
            <ModalBody>
                <Select
                    onChange={setCategory}
                    value={
                        main.accountPrototype.category
                            ? formatMessage({id: `categoryName:${main.accountPrototype.category}`})
                            : main.accountPrototype.category
                    }
                    placeholder={formatMessage({id: 'MAIN__MODAL_ADD_SELECT_CATEGORY'})}
                >
                    {main.categories.map((category) => (
                        <Option key={category.name} value={category.name} icon={<SVGIcon size={ESizes.MD} icon={category.icon} />}>
                            {formatMessage({id: `categoryName:${category.name}`})}
                        </Option>
                    ))}
                </Select>

                {main.protoCategoryFields.length ? (
                    <div className="account-form">
                        {main.protoCategoryFields.map((field: IFieldsCategory) => (
                            <Input
                                key={field.name}
                                dataBind={field.name}
                                value={field.name !== 'name' ? main.accountPrototype.data[field.name] : main.accountPrototype.name}
                                required={field.required}
                                onInput={setField}
                                placeholder={formatMessage({id: field.placeholder})}
                            />
                        ))}

                        <div className="additional-template">
                            <div>PASSGEN: {main.accountPrototype.data.password}</div>
                            <textarea />
                        </div>

                        <div>
                            <SVGIcon icon={main.accountPrototype.logotype.icon} size={ESizes.LG} />
                        </div>
                    </div>
                ) : (
                    <div className="select-category-text">{formatMessage({id: 'MAIN__MODAL_ADD_SELECT_SOME_ITEM'})}</div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={addAccount} icon={<SVGIcon icon={faDownload} />}>
                    {formatMessage({id: 'MAIN__MODAL_ADD_ACTION_ADD_ACCOUNT'})}
                </Button>
            </ModalFooter>
        </Modal>
    );
});
