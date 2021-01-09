import {FunctionComponent, useState} from 'react';
import {observer} from 'mobx-react';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
import {SVGIcon, ESizes} from 'ui';
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

    const toggleModal = (): void => setIsOpenAddModal(!isOpenAddModal);

    return (
        <>
            <ul className="header__control-accounts">
                <li className="header__icon">
                    <SVGIcon icon={faKeycdn} size={ESizes.MD} />
                </li>
                <li
                    onClick={toggleModal}
                    className={classNames('header__item', {
                        accounts_is_empty: !main.accounts.length && !isOpenAddModal,
                    })}
                >
                    {formatMessage({id: 'COMMON__ACTION_ADD'})}
                </li>
                {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_EDIT'})}</li>}
                {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_MOVE'})}</li>}
                {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_DELETE'})}</li>}
                {disable && <li className="header__item">{formatMessage({id: 'COMMON__ACTION_CANCEL'})}</li>}
            </ul>

            <AddAccountModal isOpen={isOpenAddModal} onClose={toggleModal} />
        </>
    );
});
