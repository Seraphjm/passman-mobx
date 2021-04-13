import {BaseSyntheticEvent, FunctionComponent, useState} from 'react';
import {observer} from 'mobx-react';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
import {ESizes, SVGIcon} from 'ui';
import {ESetMode} from 'Services/Enums';
import {useMainStore} from '../../../../Store/Hooks';
import {AccountModal} from '../../../Modals/Account.modal';
import {EAccountModalMode} from '../../../../Enums';

/**
 * Панель управления аккаунтами в заголовке.
 */
export const AccountsControlPanel: FunctionComponent = observer(() => {
    const main = useMainStore();
    /** Интернационализация */
    const {formatMessage} = useIntl();
    /** Состояние активности модального управления аккаунтами */
    const [isOpenAccountModal, setIsOpenAccountModal] = useState<boolean>(false);
    /** Режим в котором должно работать модальное окно управления аккаунтами */
    const [accountModalMode, setAccountModalMode] = useState<EAccountModalMode>(EAccountModalMode.ADD);
    /** Количество выбранных аккаунтов */
    const selectedAccountsLength = main.selectedAccounts.length;

    /** Функция, открывающая модальное окно аккаунта */
    const openAccountModal = (e: BaseSyntheticEvent): void => {
        setAccountModalMode(+e.target.dataset.mode);
        setIsOpenAccountModal(true);
    };

    /** Функция, закрывающая модальное окно аккаунта */
    const closeAccountModal = (): void => {
        setIsOpenAccountModal(false);
    };

    /** Функция, вызывающую отмену всех выделенных аккаунтов */
    const cancelSelected = (): void => {
        main.setSelectedAccounts(ESetMode.CLEAR);
    };

    return (
        <>
            <ul className="header__control-accounts">
                <li className="header__icon v-center">
                    <SVGIcon icon={faKeycdn} size={ESizes.MD} />
                </li>
                {!selectedAccountsLength && (
                    <li
                        onClick={openAccountModal}
                        data-mode={EAccountModalMode.ADD}
                        className={classNames('header__item', {
                            accounts_is_empty: !main.accounts.length && !isOpenAccountModal,
                        })}
                    >
                        {formatMessage({id: 'COMMON__ACTION_ADD'})}
                    </li>
                )}
                {selectedAccountsLength === 1 && (
                    <li onClick={openAccountModal} data-mode={EAccountModalMode.EDIT} className="header__item">
                        {formatMessage({id: 'COMMON__ACTION_EDIT'})}
                    </li>
                )}
                {Boolean(selectedAccountsLength) && (
                    <>
                        <li className="header__item">
                            {formatMessage({id: 'COMMON__ACTION_DELETE_COUNT'}, {count: selectedAccountsLength})}
                        </li>
                        <li className="header__item" onClick={cancelSelected}>
                            {formatMessage({id: 'COMMON__ACTION_CANCEL'})}
                        </li>
                    </>
                )}
            </ul>

            <AccountModal isOpen={isOpenAccountModal} mode={accountModalMode} onClose={closeAccountModal} />
        </>
    );
});
