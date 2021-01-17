import {BaseSyntheticEvent, FunctionComponent, SyntheticEvent, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import {Badge, Button, Card, CardBody, CardFooter, CardHeader, ESizes, Modal, ModalBody, ModalFooter, ModalHeader, SVGIcon} from 'ui';
import {faCheck, faRecycle} from '@fortawesome/free-solid-svg-icons';
import {faEye, faEyeSlash, faSave} from '@fortawesome/free-regular-svg-icons';
import {useIntl} from 'react-intl';
import {Logotype} from 'Common/Components/Logotype';
import {PassGen} from 'Common/Components/PassGen/PassGen';
import {ELanguage} from 'Modules/Settings/Enums';
import {copyToClipboard, hidePassword} from 'Utils/Utils';
import {ESetMode} from 'Services/Enums';
import {useMain} from '../../Store/Hooks';
import {IAccount, IAccountBadge} from '../../Models/Account';
import {getLocaleLastUpdate, getPreparedAccountField} from '../../Utils';
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
 * Свойства компонента рендера полей карточки аккаунта.
 *
 * @prop fields Поля.
 * @prop account Аккаунт.
 * @prop title title.
 */
interface IRenderFields {
    fields: string[];
    account: IAccount;
    title: string;
}

/**
 * Компонент отрисовки полей для карточки аккаунта.
 */
const RenderFields: FunctionComponent<IRenderFields> = observer((props) => {
    /** Интернационализация */
    const {formatMessage} = useIntl();

    return props.fields.length || props.children ? (
        <table className="account-card__table">
            <tbody>
                {props.fields?.map((field) => (
                    <tr key={field} className="account-card__table-tr">
                        <td className="account-card__table-td account-card__field-name">{formatMessage({id: `fieldName:${field}`})}:</td>
                        <td className="account-card__table-td account-card__field-value" title={props.title}>
                            {props.account.data[field]}
                        </td>
                    </tr>
                ))}
                {props.children}
            </tbody>
        </table>
    ) : null;
});

/**
 * Компонент отображения данных по аккаунту аккаунта.
 */
export const AccountCard: FunctionComponent<IProps> = observer(({account}) => {
    /** Интернационализация */
    const {formatMessage, locale} = useIntl();
    /** mobx main store */
    const main = useMain();
    /** Состояние открытия модального окна */
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    /** Состояние скрытия пароля */
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(false);

    /** Мемоизированные поля, подготовленные для отображения в карточке аккаунта */
    const fields = useMemo(() => getPreparedAccountField(account.data), [account.data]);
    /** Для избегания вызова при каждом рендере одной и той же текстовки для всех value полей, записываю в useRef */
    // todo.REFACTOR возможно будет потребность переписать на useMemo из-за смен локализаций
    const {current: title} = useRef(formatMessage({id: 'MAIN__ACCOUNT_CARD_CLICK_FOR_COPY'}));

    /** Состояние активности карточки (выделено пользователем) */
    const isActive: boolean = main.selectedAccounts.includes(account);
    /** Информация о последнем обновлении пароля */
    const lastUpdate = useMemo(() => getLocaleLastUpdate(locale as ELanguage, account.passwordLastUpdate), [
        account.passwordLastUpdate,
        locale,
    ]);

    /**
     * Добавление карточки в список выделенных.
     *
     * @param target event.target.
     */
    const addToSelected = ({target}: BaseSyntheticEvent) => {
        main.setSelectedAccounts(target.checked ? ESetMode.ADD : ESetMode.DELETE, account);
    };

    /**
     * Функция переключающая состояние модального окна обновления пароля.
     */
    const toggleModal = (): void => {
        !modalIsOpen ? main.setAccountPrototype(account) : main.resetAccountPrototype();
        setModalIsOpen(!modalIsOpen);
    };

    /**
     * Сохранение изменения пароля.
     */
    const saveChanges = (): void => {
        main.editAccount(main.accountPrototype).then(() => {
            setModalIsOpen(false);
        });
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
            <Card active={isActive} shadow={true} className="account-card">
                <CardHeader>
                    <label className="account-card__header">
                        <input
                            checked={isActive}
                            className="account-card__header-controller"
                            onChange={addToSelected}
                            data-id={account._id}
                            type="checkbox"
                        />
                        <SVGIcon icon={faCheck} className="account-card__icon" />
                        <Logotype size={ESizes.MD} logotype={account.logotype} />
                        <h2 className="account-card__label">{account.name}</h2>
                        <div className="account-card__header-badges">
                            {account.settings?.badges?.map((badge: IAccountBadge) => (
                                <Badge type={badge.type}>{badge.text}</Badge>
                            ))}
                        </div>
                        <Button onClick={toggleModal} icon={<SVGIcon size={ESizes.SM} icon={faRecycle} />} size={ESizes.SM}>
                            {formatMessage({id: 'COMMON__ACTION_UPDATE_PASSWORD'})}
                        </Button>
                    </label>
                </CardHeader>

                <CardBody className="account-card__body" onClick={copyValue} onMouseOver={copyOver} onMouseOut={copyOut}>
                    <RenderFields title={title} account={account} fields={fields.default}>
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
                    </RenderFields>

                    <RenderFields title={title} account={account} fields={fields.additional} />
                    <RenderFields title={title} account={account} fields={fields.custom} />
                </CardBody>

                <CardFooter>
                    {lastUpdate.count >= 1
                        ? formatMessage(
                              {
                                  id: 'MAIN__ACCOUNT_CARD_LAST_UPDATE',
                              },
                              {
                                  count: lastUpdate.count,
                                  period: lastUpdate.period,
                              }
                          )
                        : formatMessage({id: 'MAIN__ACCOUNT_CARD_LAST_UPDATE_TODAY'})}
                </CardFooter>
            </Card>

            <Modal className="account-card__modal" isOpen={modalIsOpen} onClose={toggleModal} size={ESizes.ES}>
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

                <ModalBody>
                    <PassGen />
                </ModalBody>

                <ModalFooter>
                    <Button
                        disabled={account.data.password === main.accountPrototype.data.password}
                        onClick={saveChanges}
                        size={ESizes.SM}
                        icon={<SVGIcon icon={faSave} />}
                    >
                        {formatMessage({id: 'COMMON__ACTION_SAVE'})}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
});
