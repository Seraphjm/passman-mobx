import {FunctionComponent, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react';
import {Button, ESizes, Input, Modal, ModalBody, ModalFooter, ModalHeader, Option, Select, SVGIcon} from 'ui';
import {useIntl} from 'react-intl';
import {IModal} from 'ui/Components/Modal/Models';
import {PassGen} from 'Common/Components/PassGen/PassGen';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {useMainStore} from '../../Store/Hooks';
import {IFieldsCategory} from '../../Store/Models';
import './AddAccount.style.scss';

/**
 * Компонент модального окна добавления нового аккаунта.
 */
export const AddAccountModal: FunctionComponent<IModal> = observer(({onClose, isOpen}) => {
    /** mobx store of main page */
    const main = useMainStore();
    /** Интернационализация*/
    const {formatMessage} = useIntl();

    const categoryName = useMemo<string>((): string => {
        const name = main.categories.find((category) => category.id === main.accountPrototype.categoryId)?.name || '';
        const id = `categoryName:${name}`;
        const message = formatMessage({id});
        return message === id ? name : message;
        // eslint-disable-next-line
    }, [main.accountPrototype.categoryId, main.categories]);

    // Находим соответствующую категорию из списка категорий, и выбираем оттуда обязательные поля.
    const requiredFields = useMemo<IFieldsCategory[]>(
        () =>
            main.categories
                .find((category) => category.id === main.accountPrototype.categoryId)
                ?.fields.filter((field) => field.required) || [],
        [main.accountPrototype.categoryId, main.categories]
    );

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
    const setCategory = (value: string): void => {
        main.setFieldAccountPrototype('categoryId', value);
    };

    /**
     * Метод добавления нового аккаунта. Так же закрывает модальное окно.
     */
    const addAccount = async (): Promise<void> => {
        await main.addAccount();
        onClose();
    };

    /**
     * Метод, определяющий доступность кнопки добавления аккаунта.
     * Должны быть категория, имя, а так же все поля указанные как обязательные.
     */
    const availableAddButton = (): boolean => {
        // Проверяется самая база: категория, пароль и имя. Без этого смысла нет дальше что-то смотреть.
        if (main.accountPrototype.categoryId && main.accountPrototype.name && main.accountPrototype.data.password) {
            for (let field of requiredFields) {
                // предполагается, что значения там все строковые, поэтому без дополнительных проверок.
                //@ts-ignore фоллбэком проверяем наличие поля прямо в accountPrototype
                if (!main.accountPrototype.data[field.name] && !main.accountPrototype[field.name]) return false;
            }
        } else return false;

        return true;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={ESizes.MD}>
            <ModalHeader onClose={onClose}>{formatMessage({id: 'MAIN__MODAL_ADD_FORM_NAME'})}</ModalHeader>
            <ModalBody>
                <Select onChange={setCategory} value={categoryName} placeholder={formatMessage({id: 'MAIN__MODAL_ADD_SELECT_CATEGORY'})}>
                    {main.categories.map((category) => (
                        <Option key={category.id} value={category.id} icon={<SVGIcon size={ESizes.MD} icon={category.icon} />}>
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
                            <PassGen required={true} />
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
                <Button disabled={!availableAddButton()} onClick={addAccount} icon={<SVGIcon icon={faDownload} />}>
                    {formatMessage({id: 'MAIN__MODAL_ADD_ACTION_ADD_ACCOUNT'})}
                </Button>
            </ModalFooter>
        </Modal>
    );
});
