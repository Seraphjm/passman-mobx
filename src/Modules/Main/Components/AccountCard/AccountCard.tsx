import {BaseSyntheticEvent, FunctionComponent, SyntheticEvent, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import {Button, Card, CardBody, CardFooter, CardHeader, ESizes, Modal, ModalBody, ModalFooter, ModalHeader, SVGIcon} from 'ui';
import {faCheck, faRecycle} from '@fortawesome/free-solid-svg-icons';
import {faEyeSlash, faSave, faEye} from '@fortawesome/free-regular-svg-icons';
import {useIntl} from 'react-intl';
import {Logotype} from 'Common/Components/Logotype';
import {copyToClipboard, hidePassword} from 'Utils/Utils';
import {IAccount} from '../../Models/Account';
import {getPreparedAccountField} from '../../Utils';
import './AccountCard.scss';

/**
 * Модель свойств компонента карточки аккаунта.
 *
 * @prop account Объект аккаунта.
 */
interface IProps {
    account: IAccount;
}

/**
 * Свойства компонента поля карточки аккаунта.
 *
 * @prop field Поле.
 * @prop value Значение.
 * @prop title title.
 */
interface IField {
    field: string;
    value: string;
    title: string;
}

/**
 * Компонент поля для карточки аккаунта.
 */
const Field: FunctionComponent<IField> = ({field, value, title}) => (
    <tr className="account-card__table-tr">
        <td className="account-card__table-td account-card__field-name">{field}:</td>
        <td className="account-card__table-td account-card__field-value" title={title}>
            {value}
        </td>
    </tr>
);

/**
 * Компонент отображения данных по аккаунту аккаунта.
 */
export const AccountCard: FunctionComponent<IProps> = observer(({account}) => {
    /** Интернационализация */
    const {formatMessage} = useIntl();
    /** Состояние активности карточки (выделено пользователем) */
    const [active, setActive] = useState<boolean>(false);
    /** Состояние открытия модального окна */
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    /** Состояние скрытия пароля */
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(false);

    /** Мемоизированные поля, подготовленные для отображения в карточке аккаунта */
    const fields = useMemo(() => getPreparedAccountField(account.data), [account.data]);
    /** Для избегания вызова при каждом рендере одной и той же текстовки для всех value полей, записываю в useRef */
    // todo.REFACTOR возможно будет потребность переписать на useMemo из-за смен локализаций
    const {current: title} = useRef(formatMessage({id: 'MAIN__ACCOUNT_CARD_CLICK_FOR_COPY'}));

    /**
     * Добавление карточки в список выделенных.
     *
     * @param target event.target.
     */
    const addToSelected = ({target}: BaseSyntheticEvent) => {
        setActive(!active);
        console.log(target.checked ? `add: ${target.dataset.id}` : `rm: ${target.dataset.id}`);
    };

    /**
     * Функция переключающая состояние модального окна обновления пароля.
     */
    const toggleModal = (): void => setModalIsOpen(!modalIsOpen);

    /**
     * Сохранение изменения пароля.
     */
    const saveChanges = (): void => {
        // todo что-то
        setModalIsOpen(false);
    };

    /**
     * Переключает состояние скрытия пароля.
     *
     * @param e event.
     */
    const showPasswordToggle = (e: SyntheticEvent<HTMLSpanElement>): void => {
        e.stopPropagation();
        setHiddenPassword(!hiddenPassword);
    };

    /**
     * Обработчик выделения ноды по наведению мыши.
     *
     * @param target event.target.
     */
    const copyOver = ({target}: BaseSyntheticEvent): void => {
        const range = document.createRange();

        range.selectNode(target);

        getSelection()?.removeAllRanges();
        getSelection()?.addRange(range);
    };

    /**
     * Обработчик по снятию выделения нод по уходу мыши с ноды
     */
    const copyOut = (): void => {
        getSelection()?.removeAllRanges();
    };

    /**
     * Копирование значения из value поля по клику.
     *
     * @param target event.target.
     */
    const copyValue = ({target}: BaseSyntheticEvent): void => {
        const isPassword = !~target.className.indexOf('account-card__field-password');

        copyToClipboard(isPassword ? target.textContent : account.data.password);

        // todo.NOTIFICATION со скрытием пароля и без.
    };

    return (
        <>
            <Card active={active} shadow={true} className="account-card">
                <CardHeader>
                    <label className="account-card__header">
                        <input className="account-card__header-controller" onClick={addToSelected} data-id={account._id} type="checkbox" />
                        <SVGIcon icon={faCheck} className="account-card__icon" />
                        <Logotype size={ESizes.MD} logotype={account.logotype} />
                        <h2 className="account-card__label">{account.name}</h2>
                        <div className="account-card__header-badges">badges</div>
                        <Button onClick={toggleModal} icon={<SVGIcon size={ESizes.ES} icon={faRecycle} />} size={ESizes.ES}>
                            {formatMessage({id: 'COMMON__ACTION_UPDATE_PASSWORD'})}
                        </Button>
                    </label>
                </CardHeader>
                <CardBody className="account-card__body" onClick={copyValue} onMouseOver={copyOver} onMouseOut={copyOut}>
                    <table className="account-card__table">
                        <tbody>
                            {!!fields.default.length &&
                                fields.default.map((field) => (
                                    <Field
                                        key={field}
                                        title={title}
                                        value={account.data[field]}
                                        field={formatMessage({id: `fieldName:${field}`})}
                                    />
                                ))}
                            <tr>
                                <td className="account-card__table-td account-card__field-name">
                                    {formatMessage({id: 'fieldName:password'})}
                                    <span className="account-card__password-icon" onClick={showPasswordToggle}>
                                        <SVGIcon icon={hiddenPassword ? faEye : faEyeSlash} />
                                    </span>
                                    :
                                </td>
                                <td
                                    className="account-card__field-value account-card__field-password"
                                    title={formatMessage({id: 'MAIN__ACCOUNT_CARD_CLICK_FOR_COPY'})}
                                >
                                    {hidePassword(account.data.password, hiddenPassword)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {!!fields.additional.length && (
                        <table className="account-card__table">
                            <tbody>
                                {fields.additional.map((field) => (
                                    <Field
                                        key={field}
                                        title={title}
                                        value={account.data[field]}
                                        field={formatMessage({id: `fieldName:${field}`})}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!!fields.custom.length && (
                        <table className="account-card__table">
                            <tbody>
                                {fields.custom.map((field) => (
                                    <Field key={field} title={title} value={account.data[field]} field={field} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardBody>
                <CardFooter>
                    {formatMessage({id: 'MAIN__ACCOUNT_CARD_LAST_UPDATE'})}: {account.passwordLastUpdate}
                </CardFooter>
            </Card>

            <Modal isOpen={modalIsOpen} onClose={toggleModal} size={ESizes.ES}>
                <ModalHeader onClose={toggleModal}>
                    {formatMessage(
                        {
                            id: 'MAIN__ACCOUNT_CARD_UPDATE_PASSWORD_FOR',
                        },
                        {
                            name: account.name,
                        }
                    )}
                </ModalHeader>
                <ModalBody>passgen</ModalBody>
                <ModalFooter>
                    <Button onClick={saveChanges} icon={<SVGIcon icon={faSave} />}>
                        {formatMessage({id: 'COMMON__ACTION_SAVE'})}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
});
