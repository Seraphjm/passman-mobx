import {FunctionComponent, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react';
import {Button, ESizes, Input, Modal, ModalBody, ModalFooter, ModalHeader, Option, Select, SVGIcon} from 'ui';
import {useIntl} from 'react-intl';
import {IModal} from 'ui/Components/Modal/Models';
import {PassGen} from 'Common/Components/PassGen/PassGen';
import {faDownload, faSave} from '@fortawesome/free-solid-svg-icons';
import isEqual from 'lodash.isequal';
import {useMainStore} from '../../Store/Hooks';
import {IFieldsCategory} from '../../Store/Models';
import {EAccountModalMode} from '../../Enums';
import {useCategoryName} from '../../Hooks';
import './AccountModal.style.scss';

/**
 * Интерфейс компонента.
 *
 * @prop mode Режим работы модального окна.
 */
interface IAccountModal {
    mode: EAccountModalMode;
}

type TAccountModal = IModal & IAccountModal;

/**
 * Компонент модального окна управления аккаунтами. Работает в режиме добавления и редактирования.
 */
export const AccountModal: FunctionComponent<TAccountModal> = observer((props) => {
    /** mobx store of main page */
    const main = useMainStore();
    /** Интернационализация*/
    const {formatMessage} = useIntl();
    /** Имя выбранной текущей категории. Нужно для интернационализации */
    const categoryName = useCategoryName(main.accountPrototype.categoryId);

    // Находим соответствующую категорию из списка категорий, и выбираем оттуда обязательные поля.
    const requiredFields = useMemo<IFieldsCategory[]>(
        () =>
            main.categories
                .find((category) => category.id === main.accountPrototype.categoryId)
                ?.fields.filter((field) => field.required) || [],
        [main.accountPrototype.categoryId, main.categories]
    );

    useEffect(() => {
        if (props.isOpen) {
            const [firstSelectedAccount] = main.selectedAccounts;
            // в случае, если модалка открыта в режиме редактирования - заполним прототип выбранным аккаунтом.
            if (props.mode === EAccountModalMode.EDIT && firstSelectedAccount) {
                main.setAccountPrototype(firstSelectedAccount);
            }
        } else main.resetAccountPrototype();
        // eslint-disable-next-line
    }, [props.isOpen, props.mode, main.selectedAccounts[0]]);

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
     * Метод, устанавливающий подкатегорию аккаунта в его прототип.
     *
     * @param value Значение подкатегории.
     */
    const setSubcategory = (value: string): void => {
        main.setFieldAccountPrototype('subcategory', value.toLocaleLowerCase());
    };

    /**
     * Метод добавления нового аккаунта. Так же закрывает модальное окно.
     */
    const addAccount = async (): Promise<void> => {
        await main.addAccount();
        props.onClose();
    };

    /**
     * Метод редактирования аккаунта. Так же закрывает модальное окно.
     */
    const editAccount = async (): Promise<void> => {
        await main.editAccount(main.accountPrototype);
        props.onClose();
    };

    /**
     * Метод, проверяющий заполненность всех обязательных полей.
     */
    const checkFilledRequiresFields = (): boolean => {
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

    /**
     * Метод, определяющий доступность кнопки сохранения изменённых данных аккаунта.
     * Должны быть заполнены все обязательные поля и должна быть разница между текущими данными и изменёнными.
     */
    const availableEditButton = (): boolean => checkFilledRequiresFields() && !isEqual(main.accountPrototype, main.selectedAccounts[0]);

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size={ESizes.MD}>
            <ModalHeader onClose={props.onClose}>{formatMessage({id: 'MAIN__MODAL_ADD_FORM_NAME'})}</ModalHeader>
            <ModalBody>
                <Select onChange={setCategory} value={categoryName} placeholder={formatMessage({id: 'MAIN__MODAL_ADD_SELECT_CATEGORY'})}>
                    {main.categories.map((category) => (
                        <Option key={category.id} value={category.id} icon={<SVGIcon size={ESizes.MD} icon={category.icon} />}>
                            {formatMessage({id: `categoryName:${category.name}`})}
                        </Option>
                    ))}
                </Select>

                {main.accountPrototype.categoryId && (
                    <Input
                        placeholder={formatMessage({id: 'MAIN__MODAL_ADD_ENTER_SUBCATEGORY'})}
                        autoComplete={main.subcategories}
                        value={main.accountPrototype.subcategory}
                        onInput={setSubcategory}
                    />
                )}

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
                {props.mode === EAccountModalMode.ADD ? (
                    <Button disabled={!checkFilledRequiresFields()} onClick={addAccount} icon={<SVGIcon icon={faDownload} />}>
                        {formatMessage({id: 'MAIN__MODAL_ADD_ACTION_ADD_ACCOUNT'})}
                    </Button>
                ) : (
                    <Button disabled={!availableEditButton()} onClick={editAccount} icon={<SVGIcon icon={faSave} />}>
                        {formatMessage({id: 'COMMON__ACTION_SAVE'})}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
});
