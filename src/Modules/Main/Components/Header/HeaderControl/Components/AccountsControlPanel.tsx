import {FunctionComponent, useState} from 'react';
import {observer} from 'mobx-react';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
import {ESizes, SVGIcon} from 'ui';
import {ESetMode} from 'Services/Enums';
import {useMain} from '../../../../Store/Hooks';
import {AddAccountModal} from '../../../Modals/AddAccount.modal';

/**
 * Панель управления аккаунтами в заголовке.
 */
export const AccountsControlPanel: FunctionComponent = observer(() => {
    const main = useMain();
    /** Интернационализация */
    const {formatMessage} = useIntl();
    /** Состояние активности модального окна добавления аккаунта */
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);

    /*TODO.REMOVE*/
    const disable = false;
    /** Количество выбранных аккаунтов */
    const selectedAccountsLength = main.selectedAccounts.length;

    /** Функция, переключающая состояние модального окна добавления аккаунта */
    const toggleAddModal = (): void => setIsOpenAddModal(!isOpenAddModal);

    /** Функция, вызывающую отмену всех выделенных аккаунтов */
    const cancelSelected = (): void => {
        main.setSelectedAccounts(ESetMode.CLEAR);
    };

    return (
        <>
            <ul className="header__control-accounts">
                <li className="header__icon">
                    <SVGIcon icon={faKeycdn} size={ESizes.MD} />
                </li>
                {!selectedAccountsLength && (
                    <li
                        onClick={toggleAddModal}
                        className={classNames('header__item', {
                            accounts_is_empty: !main.accounts.length && !isOpenAddModal,
                        })}
                    >
                        {formatMessage({id: 'COMMON__ACTION_ADD'})}
                    </li>
                )}
                {selectedAccountsLength === 1 && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_EDIT'})}</li>}
                {Boolean(selectedAccountsLength) && (
                    <>
                        {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_MOVE'})}</li>}
                        {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_DELETE'})}</li>}
                        <li className="header__item" onClick={cancelSelected}>
                            {formatMessage({id: 'COMMON__ACTION_CANCEL'})}
                        </li>
                    </>
                )}
            </ul>

            <AddAccountModal isOpen={isOpenAddModal} onClose={toggleAddModal} />
        </>
    );
});
