import {FunctionComponent, useState} from 'react';
import {observer} from 'mobx-react';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import {useMain} from '../../../../Store/Hooks';
import {AddAccountModal} from '../Modals/AddAccount.modal';

/**
 * Панель управления аккаунтами.
 */
export const AccountsControlPanel: FunctionComponent = observer(() => {
    const main = useMain();
    const [open, setOpen] = useState<boolean>(false);
    const {formatMessage} = useIntl();

    const openAddAccount = () => {
        setOpen(true);
    };

    const closeHandler = () => setOpen(false);

    return (
        <>
            <ul className="header__control-accounts">
                <li className="header__icon fab fa-keycdn" />
                <li
                    onClick={openAddAccount}
                    className={classNames('header__item', {
                        accounts_is_empty: !main.accounts.length && !open,
                    })}
                >
                    {formatMessage({id: 'COMMON__ACTION_ADD'})}
                </li>
                <li className="header__item">{formatMessage({id: 'COMMON__ACTION_EDIT'})}</li>
                <li className="header__item">{formatMessage({id: 'COMMON__ACTION_MOVE'})}</li>
                <li className="header__item">{formatMessage({id: 'COMMON__ACTION_DELETE'})}</li>
                <li className="header__item">{formatMessage({id: 'COMMON__ACTION_CANCEL'})}</li>
            </ul>

            <AddAccountModal isOpen={open} onClose={closeHandler} />
        </>
    );
});
